class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable

  has_and_belongs_to_many :roles
  has_many :queries
  has_many :favourite_locations
  has_many :locations

  VALID_EMAIL_PATTERN = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i

  scope :superadmins, includes(:roles).where("roles.name = 'superadmin'")

  def self.load_seeds
    User.create(email: 'admin@mepaseaste.uy', password: 'superadmin')   unless User.find_by_email('admin@mepaseaste.uy')
    User.create(email: 'gabriel@mepaseaste.uy', password: 'superadmin') unless User.find_by_email('gabriel@mepaseaste.uy')
    User.create(email: 'renzo@mepaseaste.uy', password: 'superadmin')   unless User.find_by_email('renzo@mepaseaste.uy')
    User.create(email: 'sergio@mepaseaste.uy', password: 'superadmin')  unless User.find_by_email('sergio@mepaseaste.uy')
  end

  def has_role(role_name)
    roles.include?(Role.where(name: role_name).first)
  end

  def add_role(role_name)
    role = Role.where(name: role_name).first
    roles << role unless roles.include?(role)
  end

  def recent_queries(quantity)
    queries.limit(quantity)
  end

  def remove_role(role_name)
    role = Role.where(name: role_name).first
    roles.delete(role)
  end

  def superadmin?
    has_role('superadmin')
  end

  def user?
    has_role('user')
  end

end
