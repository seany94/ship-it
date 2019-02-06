class RegistrationsController < Devise::RegistrationsController

  prepend_before_action :check_captcha, only: [:create]

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