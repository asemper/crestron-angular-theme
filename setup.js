const prompt = require('prompt-list');
const editJsonFile = require("edit-json-file");
const fs = require('fs');
const jsonSass = require('json-sass-vars');

let config = editJsonFile(`config.json`);

var Fonts = new prompt({
  name: 'Theme Setup',
  message: 'What size fonts would you like to configure this theme with ?',
  choices: [
    'Default',
    'Large'
  ]
});

var PrimaryColor = new prompt({
  name: 'Theme Setup',
  message: 'What primary color would you like to use ?',
  choices: [
    'Default',
    'Blue',
    'Gray',
    'White'
  ]
});

var AccentColor = new prompt({
  name: 'Theme Setup',
  message: 'What accent color would you like to use ?',
  choices: [
    'Default',
    'Blue',
    'Gray',
    'White'
  ]
});

// Configure fonts
Fonts.run()
  .then(function(answer) {
    config.set("FontSize",answer);
    console.log('Configuring theme with ' + answer + ' font sizes');
    // Configure primary color
    PrimaryColor.run()
      .then(function(answer){
        config.set("PrimaryColor",answer);
        console.log('Configuring theme primary color to ' + answer);
        // Configure secondary color
        AccentColor.run()
          .then(function(answer){
            config.set("AccentColor",answer);
            console.log('Configuring theme accent color to ' + answer);
            // Update JSON Config and create SASS config
            LoadConfiguration(); 
          });
      });
  });


LoadConfiguration = () => {
  config.save();
  CreateSassConfig();
};

CreateSassConfig = () => {
  fs.createReadStream('config.json')
  .pipe(jsonSass({
    prefix: '$theme-config: ',
  }))
  .pipe(fs.createWriteStream('_theme-config.scss'));
};
