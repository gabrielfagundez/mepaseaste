class AddRoleModel < ActiveRecord::Migration
  def change
    create_table(:roles) do |t|
      t.string :name,               :null => false, :default => ""
      t.timestamps
    end
  end
end
