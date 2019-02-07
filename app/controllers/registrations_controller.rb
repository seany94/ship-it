class RegistrationsController < Devise::RegistrationsController

  prepend_before_action :check_captcha, only: [:create]

  # def create
  #   @user = User.new(sign_up_params)
  #   byebug
  #   uploaded_file = params[:user][:profile_picture].path
  #   cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)

  #   #store this public_id value to the database
  #   #cloudnary_file['public_id']

  #   @user.profile_picture = cloudnary_file['secure_url']
  #   byebug


  #   respond_to do |format|
  #     if @user.save
  #       format.html { redirect_to @user, notice: 'You have signed up successfully created.' }
  #       format.json { render :show, status: :created, location: @user }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end


  def create
    @user = User.new(sign_up_params)


    uploaded_file = params[:user][:profile_picture].path
    cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)
    #store this public_id value to the database
    #cloudnary_file['public_id']

    @user.profile_picture = cloudnary_file['secure_url']


    byebug
    @user.save
    yield @user if block_given?
    if @user.persisted?
      if @user.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(:user, @user)
        respond_with @user, location: after_sign_up_path_for(@user)
      else
        set_flash_message! :notice, :"signed_up_but_#{@user.inactive_message}"
        expire_data_after_sign_in!
        respond_with @user, location: after_inactive_sign_up_path_for(@user)
      end
    else
      clean_up_passwords @user
      set_minimum_password_length
      respond_with @user
    end
  end


  private

  def check_captcha
    unless verify_recaptcha
    self.resource = resource_class.new sign_up_params
    resource.validate # Look for any other validation errors besides Recaptcha
    set_minimum_password_length
    respond_with resource
    end
  end




  def sign_up_params

    params.require(:user).permit(:username, :profile_picture, :email, :password, :password_confirmation)

        # @user = User.new(params)

    # uploaded_file = params[:user][:profile_picture].path
    # cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)

    #store this public_id value to the database
    #cloudnary_file['public_id']
# byebug
#     params[:user][:profile_picture] = cloudnary_file['secure_url']
  end

  def account_update_params
    params.require(:user).permit(:username, :profile_picture, :email, :password, :password_confirmation, :current_password)
  end
end