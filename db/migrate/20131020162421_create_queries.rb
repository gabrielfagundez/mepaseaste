class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.integer :cantidad_marcadores,               :null => false, :default => ''

      t.integer :user_id

      t.timestamps
    end
  end
end
