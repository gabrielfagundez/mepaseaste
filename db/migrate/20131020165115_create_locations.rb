class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.integer :query_id
      t.integer :location_query_pos
      t.string  :latitude
      t.string  :longitude
      t.string  :icon

      t.string  :address

      t.timestamps
    end
  end
end
