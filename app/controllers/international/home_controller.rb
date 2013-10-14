class International::HomeController < ApplicationController
  layout 'international'

  def index
    # Borramos ejecucion previa del algoritmo si existe
    begin
      FileUtils.rm('public/raw_results.txt')
    rescue
    end
    begin
      FileUtils.rm('public/sol.txt')
    rescue
    end
  end

end
