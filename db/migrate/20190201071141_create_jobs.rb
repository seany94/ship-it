class CreateJobs < ActiveRecord::Migration[5.2]
  def change
    create_table :jobs do |t|
      t.string :title
      t.string :package_picture
      t.string :start_location
      t.string :end_location
      t.datetime :date_pickup
      t.datetime :date_delivery
      t.boolean :accepted
      t.boolean :completed
      t.references :user, foreign_key: true
      t.integer :acceptor_id
      t.decimal :start_lat
      t.decimal :start_long
      t.decimal :end_lat
      t.decimal :end_long

      t.timestamps
    end
  end
end