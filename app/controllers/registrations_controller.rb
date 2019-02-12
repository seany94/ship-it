class RegistrationsController < Devise::RegistrationsController

  prepend_before_action :check_captcha, only: [:create]
  prepend_before_action :update_captcha, only: [:update]

  def create
    cookies[:nav] = "true"
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

  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    if resource.profile_picture == nil
      p 'profile pic is nil'
      resource.profile_picture = 'https://s3-eu-west-2.amazonaws.com/mlwpobjects/wordpress/wp-content/uploads/2018/05/25131249/No-Profile-Picture.jpg'
    else
      p 'profile pic is not nil'
      if resource.profile_picture != 'https://s3-eu-west-2.amazonaws.com/mlwpobjects/wordpress/wp-content/uploads/2018/05/25131249/No-Profile-Picture.jpg'

      uploaded_file = params[:user][:profile_picture].path
      cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)

      test = account_update_params
      test[:profile_picture] = cloudnary_file['secure_url']
      resource_updated = update_resource(resource, test)
    end
    end
      resource_updated = update_resource(resource, account_update_params)
    yield resource if block_given?
    if resource_updated
      set_flash_message_for_update(resource, prev_unconfirmed_email)
      bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?

      respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  def destroy
    @user = current_user
    Job.where(:acceptor_id => @user.id).update_all(:acceptor_id => nil)
    Job.where(:acceptor_id => @user.id).update_all(:accepted => false)
    super
  end

  private

  def set_flash_message_for_update(resource, prev_unconfirmed_email)
    return unless is_flashing_format?

    flash_key = if update_needs_confirmation?(resource, prev_unconfirmed_email)
      :update_needs_confirmation
    elsif sign_in_after_change_password?
      :updated
    else
      :updated_but_not_signed_in
    end
    set_flash_message :notice, flash_key
  end

  def sign_in_after_change_password?
    return true if account_update_params[:password].blank?

    Devise.sign_in_after_change_password
  end

  def check_captcha
    unless verify_recaptcha
      self.resource = resource_class.new sign_up_params
      resource.validate # Look for any other validation errors besides Recaptcha
      set_minimum_password_length
      flash[:error] = "reCAPTCHA verification failed, please try again."
      redirect_to root_path
    end
  end

  def update_captcha
    unless verify_recaptcha
      flash[:error] = "reCAPTCHA verification failed, please try again."
      redirect_to edit_user_registration_url
    end
  end

def sign_up_params
  params.require(:user).permit(:username, :profile_picture, :email, :password, :password_confirmation)
end

def account_update_params
  params.require(:user).permit(:username, :profile_picture, :email, :password, :password_confirmation, :current_password)
end
end