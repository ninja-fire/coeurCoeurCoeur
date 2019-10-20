const path = require('path');
const resizer = require('node-image-resizer');
const logoPath = path.join(__dirname, `../web/assets/icon.png`);

const resizeConfig = {
  all: {
    path: path.join(__dirname, `../web/assets/icons/`),
  },
  versions: [
    {
      suffix: `-192`,
      width: 192,
      height: 192,
    },
    // { suffix: `-iphone-6-plus`, width: 180, height: 180 },
    // { suffix: `-ipad-retina`, width: 152, height: 152 },
    { suffix: `-web-app-144`, width: 144, height: 144 },
    // { suffix: `-iphone-retina`, width: 120, height: 120 },
    // { suffix: `-ipad`, width: 76, height: 76 },
    // { suffix: `-iphone`, width: 57, height: 57 },
  ],
};

(async () => {

  await resizer(logoPath, resizeConfig);

})().catch(error => console.error(error) );
