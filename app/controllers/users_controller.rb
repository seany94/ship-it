class UsersController < ApplicationController

  before_action :authenticate_user!, :except => [ :show, :index ]

  def home
    @users = User.all
  end

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
      @jobs = Job.where(:user_id => current_user.id).where.not(:acceptor_id => nil).where(:completed => false)
    elsif params[:job] == '5'
      @users = User.all
      @jobs = Job.where(:user_id => current_user.id).where(:acceptor_id => nil)
    end
  end

  def show
    @users = User.find(params[:id])
    @jobs = nil
    if params[:job] == '1'
      @users = User.find(params[:id])
      @jobs = Job.where(:user_id => @users)
    elsif params[:job] == '2'
      @users = User.find(params[:id])
      @jobs = Job.where(:acceptor_id => @users)
    elsif params[:job] == '3'
      @users = User.find(params[:id])
      @jobs = Job.where(:user_id => @users).or(Job.where(:acceptor_id => @users)).where(:completed => true)
    elsif params[:job] == '4'
      @users = User.find(params[:id])
      @jobs = Job.where(:user_id => current_user.id).where.not(:acceptor_id => nil).where(:completed => false)
    elsif params[:job] == '5'
      @users = User.find(params[:id])
      @jobs = Job.where(:user_id => current_user.id).where(:acceptor_id => nil)
    end
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