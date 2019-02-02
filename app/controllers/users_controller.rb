class UsersController < ApplicationController

  before_action :authenticate_user!, :except => [ :show, :index ]

  def index
    @users = User.all
    @jobs = nil
    if params[:job] == '1'
      @users = User.all
      @jobs = Job.where(:user_id => current_user.id)
    elsif params[:job] == '2'
      @users = User.all
      @jobs = Job.where(:acceptor_id => current_user.id)
    elsif params[:job] == '3'
      @users = User.all
      @jobs = Job.where(:user_id => current_user.id).or(Job.where(:acceptor_id => current_user.id)).where(:completed => true)
    elsif params[:job] == '4'
      @users = User.all
      @jobs = Job.where(:user_id => current_user.id).or(Job.where(:acceptor_id => current_user.id)).where(:completed => false)
    end
  end

  def show
  end

  def new
  end

  def edit
  end

  def create
  end

  def update
  end

  def destroy
  end

  protected

end