class Locations < ActiveRecord::Migration[5.2]
  def change
    create_table :locations do |t|
      t.text :place_id
      t.text :name
      t.text :address
      t.float :latitude
      t.float :longitude
      t.text :photo_url
      t.timestamps
    end
  end
end
