class TablaDestinos < ActiveRecord::Migration
  def change
    create_table(:destinos) do |t|
      t.string :ubicacion,               :null => false, :default => ''
      t.string :nombre,                  :null => false, :default => ''
      t.integer :user_id

      t.timestamps
    end
  end
end
