class Api::QueriesController < Api::ApiController

  def create
    puts params.inspect

    fake_json_response = {
        tipo_tarifa: 'diurna',
        costo_total: '20',
        cant_taxis: '2',
        cant_destinos: '3'
    }

    render json: fake_json_response.to_json
  end

end