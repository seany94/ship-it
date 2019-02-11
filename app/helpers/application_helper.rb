module ApplicationHelper
  def active_class(link_path)
    current_page?(link_path) ? 'active' : ""
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def flash_class(level)
    case level.to_sym
      when :alert then "alert alert-success"
    end
  end
end