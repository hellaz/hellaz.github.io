
# Require any additional compass plugins here.
require 'compass-normalize' # Permite el uso de normalizer.css sin tener que descargar la libreria
require 'rgbapng' 			# Greneral una compatitbilida entre navegadores para el uso de rgba
require 'toolkit'			# Serie de heraamientas que permiten el uso de estilos avanzados en sass
require 'susy'				# Ayuda en la contriccion de layout con una sintaxis simple y natural 
require 'sass-globbing'		# Permite en uso de la directiva @import de Sass
require 'breakpoint'
#require 'toolkit-no-css'

# Set this to the root of your project when deployed:

project_type = :stand_alone # Can be :stand_alone or :rails. Defaults to :stand_alone.
http_path = "/"				# The path to the project when running within the web server. Defaults to "/"
sass_dir = "sass"			# The directory where the sass stylesheets are kept. It is relative to the project_path. Defaults to "sass"
css_dir = "css"				# The directory where the css stylesheets are kept. It is relative to the project_path. Defaults to "stylesheets".
images_dir = "img"			# The directory where the images are kept. It is relative to the project_path. Defaults to "images"		 
javascripts_dir = "js"		# The directory where the javascripts are kept. It is relative to the project_path. Defaults to "javascripts"
line_comments = false		# Indicates whether line comments should be added to compiled css that says where the selectors were defined. Defaults to false in production mode, true in development mode.
preferred_syntax = :scss	# Can be :scss or :sass. Defaults to :scss
output_style = :expanded	# The output style for the compiled css. One of: :nested, :expanded, :compact, or :compressed
relative_assets = true		# Indicates whether the compass helper functions should generate relative urls from the generated css to assets, or absolute urls using the http path for that asset type

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
