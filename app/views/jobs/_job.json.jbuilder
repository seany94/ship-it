json.extract! job, :id, :start_location, :end-location, :date_pickup, :date_delivery, :accepted, :completed, :user_id, :created_at, :updated_at
json.url job_url(job, format: :json)
