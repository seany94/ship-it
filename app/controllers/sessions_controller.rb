class SessionsController < Devise::SessionsController

    def new
      cookies[:nav] = "true"
      super
    end

    def create
        resource = User.find_for_database_authentication(email: params[:user][:email])
        cookies[:nav] = "true"
        return invalid_login_attempt unless resource
        if resource.valid_password?(params[:user][:password])
            sign_in :user, resource
            redirect_to root_url
            return
        end
        invalid_login_attempt
    end


    def destroy
      cookies.delete :nav
      super
    end
    
    protected
    def invalid_login_attempt
        render :json => {"error" => "Invalid username or password"}, status: 401
    end

end