class Job < ApplicationRecord
    belongs_to :user
    # :acceptor = what rails console will refer to e.g. Job.acceptor
    # :foreign_key => 'acceptor_id' = the column in jobs table
    # :class-name => 'User' = using the above integer of 'acceptor_id' column, used as id to call the row in 'User' table
    belongs_to :acceptor, :foreign_key => 'acceptor_id', :class_name => 'User', :optional => true
    # validates :acceptor_id, presence: false
end