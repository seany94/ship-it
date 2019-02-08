class RegistrationsController < Devise::RegistrationsController

  prepend_before_action :check_captcha, only: [:create]

  def create
    @user = User.new(sign_up_params)

        if @user.profile_picture == nil
          p 'profile pic is nil'
          @user.profile_picture = 'https://s3-eu-west-2.amazonaws.com/mlwpobjects/wordpress/wp-content/uploads/2018/05/25131249/No-Profile-Picture.jpg'
        else
          p 'profile pic is not nil'
    uploaded_file = params[:user][:profile_picture].path
    cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)

    @user.profile_picture = cloudnary_file['secure_url']
        end
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

  def destroy
    @user = current_user
    Job.where(:acceptor_id => @user.id).update_all(:acceptor_id => nil)
    Job.where(:acceptor_id => @user.id).update_all(:accepted => false)
    super
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
  end

  def account_update_params
    params.require(:user).permit(:username, :profile_picture, :email, :password, :password_confirmation, :current_password)
  end
end