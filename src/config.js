"use strict";

exports.defaults = function() {
  return {
    iced: {
      extensions: ["iced"],
      sourceMapDynamic: true,
      sourceMapExclude: [/\/specs?\//, /_spec.js$/],
      sourceMapConditional: false,
      options: {
        sourceMap: true,
        bare: true,
        runtime: "none"
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n"+
         "  # iced:                      # config settings for the iced coffeescript compiler module\n" +
         "    # lib: undefined           # use this property to provide a specific version of Iced CoffeeScript\n" +
         "    # extensions: [\"iced\"]   # default extensions for Iced CoffeeScript files\n" +
         "    # sourceMapDynamic: true   # whether or not to inline the source maps in the compiled JavaScript\n" +
         "    # sourceMapExclude: [/\\/specs?\\//, /_spec.js$/] # files to exclude from source map generation\n" +
         "    # sourceMapConditional: false # whether or not to use conditional source maps\n" +
         "    # options:                 # options for the Iced CoffeeScript compiler\n" +
         "      # sourceMap:true         # whether or not to create source maps\n" +
         "      # bare:true              # whether or not to use the default safety wrapper\n" +
         "      # runtime:\"none\"         # No runtime boilerplate is included";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "iced coffeescript config", config.iced ) ) {

    if ( !config.iced.lib ) {
      config.iced.lib = require( 'iced-coffee-script' );
    }

    if ( validators.isArrayOfStringsMustExist( errors, "iced.extensions", config.iced.extensions ) ) {
      if (config.iced.extensions.length === 0) {
        errors.push( "iced.extensions cannot be an empty array");
      }
    }

    if ( config.isBuild ) {
      config.iced.sourceMap = false;
    } else {
      validators.ifExistsIsBoolean( errors, "iced.sourceMapConditional", config.iced.sourceMapConditional );

      if ( validators.ifExistsIsBoolean( errors, "iced.sourceMapDynamic", config.iced.sourceMapDynamic ) ) {
        if (config.isWatch && config.isMinify && config.iced.sourceMapDynamic ) {
          config.iced.sourceMapDynamic = false;
          config.log.debug( "mimosa watch called with minify, setting iced.sourceMapDynamic to false to preserve source maps." );
        }
      }

      validators.ifExistsFileExcludeWithRegexAndStringWithField(
        errors,
        "iced.sourceMapExclude",
        config.iced,
        'sourceMapExclude',
        config.watch.javascriptDir );
    }
  }

  return errors;
};
