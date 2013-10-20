class HomeController < ApplicationController
  def index

    # Borramos ejecucion previa del algoritmo si existe
    #begin
    #  FileUtils.rm('public/raw_results.txt')
    #rescue
    #end
    begin
      FileUtils.rm('public/parametros.txt')
    rescue
    end
    begin
      FileUtils.rm('public/sol.txt')
    rescue
    end
    begin
      FileUtils.rm('public/costos.txt')
    rescue
    end

    unless current_user
      redirect_to '/presentacion.html'
    end
  end
end
