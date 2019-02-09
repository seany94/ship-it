class UsersController < ApplicationController

  before_action :authenticate_user!, :except => [ :show, :index ]

  def home
    @users = User.all
  end

  def index
    @users = User.all
    @jobs = Job.all
  end

  def show
    @users = User.find(params[:id])
    @jobs = Job.all
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