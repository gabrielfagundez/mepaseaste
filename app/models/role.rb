class Role < ActiveRecord::Base

  ROLES_BY_PRIVILEGE = ['superadmin', 'user']

  has_and_belongs_to_many :users

  def self.load_seeds
    amount_loaded = 0
    Role.delete_all
    ROLES_BY_PRIVILEGE.each_with_index do |role_name, index|
      role = Role.where(name: role_name).first
      if role.blank?
        role = Role.new(name: role_name)
        role.id = index + 1
        role.save!
        amount_loaded += 1
      end
    end
    amount_loaded
  end

  def superadmin?
    self.name == 'superadmin'
  end

  def user?
    self.name == 'user'
  end
end