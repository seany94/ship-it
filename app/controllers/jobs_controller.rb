class JobsController < ApplicationController
  before_action :set_job, only: [:show, :edit, :update, :destroy]

  # GET /jobs
  # GET /jobs.json
  def index
    @jobs = Job.all
  end

  # GET /jobs/1
  # GET /jobs/1.json
  def show
    @job = Job.find(params[:id])
  end

  # GET /jobs/new
  def new
    @job = Job.new
  end

  # GET /jobs/1/edit
  def edit
    @job = Job.find(params[:id])
  end

  # POST /jobs
  # POST /jobs.json
  def create
    @job = Job.new(job_params)
    @job.user_id = current_user.id
        @job.acceptor_id = nil
        if @job.package_picture == nil
          p 'profile pic is nil'
          @job.package_picture = 'https://media.istockphoto.com/vectors/box-icon-flat-design-style-parcel-simple-silhouette-modern-minimalist-vector-id1033754126?k=6&m=1033754126&s=612x612&w=0&h=X4dkpNwkjkh568SQ8FvFUo7aKEZT-kdxPUBcYTeUZRA='
        else
          p 'profile pic is not nil'
          uploaded_file = params[:job][:package_picture].path
          cloudnary_file = Cloudinary::Uploader.upload(uploaded_file)
          #store this public_id value to the database
          #cloudnary_file['public_id']
          @job.package_picture = cloudnary_file['secure_url']
        end
    flash[:alert] = "Congratulation job #{@job.title.capitalize} has been successfully created and added to your profile"
    @job.save
    redirect_to root_path

    # respond_to do |format|
    #   if @job.save
    #     format.html { redirect_to @job, notice: 'Job was successfully created.' }
    #     format.json { render :show, status: :created, location: @job }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @job.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /jobs/1
  # PATCH/PUT /jobs/1.json
  def update
    @job = Job.find(params[:id])
    if Job.where.not(:user_id => current_user.id)
      Job.where(:id => @job).update_all(:acceptor_id => current_user.id)
      Job.where(:id => @job).update_all(:accepted => true)
      flash[:alert] = "Congratulation job #{@job.title.capitalize} has been successfully accepted and added to your profile"
      redirect_to root_path
    elsif Job.where(:id => @job).where(:accepted => true).where(:user_id => current_user.id)
      Job.where(:id => @job).update_all(:completed => true)
      flash[:alert] = "Congratulation job #{@job.title.capitalize} has been successfully marked completed and updated on your profile"
      redirect_to root_path
    end
    # respond_to do |format|
    #   if @job.update(job_params)
    #     format.html { redirect_to @job, notice: 'Job was successfully updated.' }
    #     format.json { render :show, status: :ok, location: @job }
    #   else
    #     format.html { render :edit }
    #     format.json { render json: @job.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /jobs/1
  # DELETE /jobs/1.json
  def destroy
    @job.destroy
    respond_to do |format|
      format.html { redirect_to jobs_url, notice: 'Job was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def map
    gon.jobs = Job.all
    @jobs = Job.where.not(:user_id => current_user.id).where(:accepted => false)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_job
      @job = Job.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def job_params
      params.require(:job).permit(:title, :package_picture, :start_location, :end_location, :date_pickup, :date_delivery, :accepted, :completed, :user_id, :acceptor_id, :start_lat, :start_long, :end_lat, :end_long)
    end
end