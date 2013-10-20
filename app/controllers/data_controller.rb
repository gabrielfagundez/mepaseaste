class DataController < ApplicationController
  skip_before_filter :verify_authenticity_token,  only: [ :process_data ]

  before_filter :crear_matriz_de_distancias,      only: [ :process_data ]
  append_before_filter :crear_matriz_de_costos,   only: [ :process_data ]


  #
  # El algoritmo evolutivo necesita de 4 parametros para funcionar.
  #   - La ruta del archivo binario a ser ejecutado.
  #   - La ruta del archivo de configuración paramétrica.
  #   - La ruta del archivo de parámetros específicos.
  #   - La ruta de la solución.
  #
  # Además, utilizamos un comando para filtrar resultados y brindamos los
  # mismos de forma amigable.
  #
  def process_data

    # Ejecutamos el algoritmo evolutivo
    IO.popen("bin/genetic_algorithm #{ archivo_de_configuracion } #{ archivo_de_parametros } #{ archivo_de_solucion } | grep ^Solution: > #{ archivo_simplificado }")


    # Renderizamos la nueva pagina
    respond_to do |format|
      format.js {
        render text: 'window.location.replace("/show_data");'
      }
    end
  end

  def show_data

  end

  private
  def archivo_de_configuracion
    @archivo_configuracion ||= AE_CONFIG['archivo_de_configuracion']
  end

  def archivo_de_solucion
    @archivo_solucion ||= AE_CONFIG['archivo_de_solucion']
  end

  def archivo_simplificado
    @archivo_simplificado ||= AE_CONFIG['archivo_simplificado']
  end

  def tipo_tarifa
    @tupo_tarifa ||= params[:tipo_tarifa]
  end

  def cantidad_marcadores
    @cantidad_marcadores ||= params[:marcadores].size
  end

  def crear_matriz_de_distancias
    distancias = params[:marcadores]

    # Matriz de distancias
    @matriz_distancias  = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }

    # Rellenamos la matriz de distancias
    for i in 0..cantidad_marcadores - 1 do
      @matriz_distancias[i][i] = 0
      for j in 0..i do
        @matriz_distancias[i][j] = distancias[i][j] if i != j
        @matriz_distancias[j][i] = distancias[i][j] if i != j
      end
    end
  end

  def crear_matriz_de_costos

    # Matriz de costos
    @matriz_costos  = Array.new(cantidad_marcadores) { Array.new(cantidad_marcadores) }

    # Rellenamos la matriz de costos
    for i in 0..(cantidad_marcadores - 1) do
      for j in 0..(cantidad_marcadores - 1) do
        if @matriz_distancias[i][j] > 100
          costo_actual = 0
          costo_actual += tipo_tarifa == 'diurna' ? (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_DIURNO) : (((@matriz_distancias[i][j])/100).to_i) * (CIEN_METROS_NOCTURNO)
          @matriz_costos[i][j] = costo_actual
        else
          @matriz_costos[i][j] = 0
        end
      end
    end
  end

  #
  # El siguiente archivo posee la configuración para la
  # ejecución en particular
  # El mismo posee la siguiente estructura:
  #   5
  #   27.71
  #   0
  #   public/costos.txt
  #
  # Donde el primer lugar corresponde a la cantidad de lugares a ser rellenados
  # por el algoritmo evolutivo, el segundo al costo de la bandera y el cuarto a
  # la ubicación del archivo correspondiente a la matriz de costos.
  #
  def archivo_de_parametros
    FileUtils.touch(AE_CONFIG['archivo_de_parametros'])

    cantidad = 2 * (cantidad_marcadores - 1) - 1

    File.open(AE_CONFIG['archivo_de_parametros'], 'w') do |file|
      file.write cantidad
      file.write "\n"
      tipo_tarifa == 'diurna' ? (file.write BANDERA_DIURNA) : (file.write BANDERA_NOCTURNA)
      file.write "\n"
      file.write '0'
      file.write "\n"
      file.write AE_CONFIG['archivo_de_costos']
    end

    # Creamos el archivo de costos
    archivo_de_costos

    AE_CONFIG['archivo_de_parametros']
  end

  #
  # El siguiente archivo posee una matriz de costos entre los
  # diferentes destinos que va a utilizar el algoritmo evolutivo.
  # El mismo debe tener la siguiente estructura:
  #   0 161.0 305.9 334.88
  #   161.0 0 191.59 178.71
  #   305.9 191.59 0 305.9
  #   334.88 178.71 305.9 0
  #
  def archivo_de_costos
    FileUtils.touch(AE_CONFIG['archivo_de_costos'])

    File.open(AE_CONFIG['archivo_de_costos'], 'w') do |file|
      for i in 0..(cantidad_marcadores - 1) do
        for j in 0..(cantidad_marcadores - 1) do
          file.write @matriz_costos[i][j]
          file.write ' '
        end
        file.write "\n"
      end
    end
  end

end
