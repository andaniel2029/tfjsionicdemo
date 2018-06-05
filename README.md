**Tensorflow Pre-Trained Model Import in Ionic Demo**

This demo shows how to use tensorflowjs in ionic framework.
However, it works only when you run on the server. ie. http://localhost:8100/ionic-lab

It doesn't work when you build apk for android then install apk file on an Andorid phone.
In detail,tf.loadModel not working it shows **"TypeError: Failed to fetch"**

**Requirements**

cli packages: (C:\Users\Administrator\AppData\Roaming\npm\node_modules)

    @ionic/cli-utils  : 1.19.2    
    ionic (Ionic CLI) : 3.20.0

global packages:

    cordova (Cordova CLI) : not installed

local packages:

    @ionic/app-scripts : 3.1.8
    Cordova Platforms  : none
    Ionic Framework    : ionic-angular 3.9.2

System:

    Android SDK Tools : 25.2.5
    Node              : v8.9.1
    npm               : 5.6.0
    OS                : Windows 10

Environment Variables:

    ANDROID_HOME : F:\android-sdk

Misc:

    backend : legacy


**Installation**

npm install

**Usage**

cd yourproejct

ionic serve --lab

**Tests**

Run this command to see web version

ionic serve --lab 


For Android app test, you need to build first using following command

ionic cordova platform add android

ionic cordova build android --prod --release

You can find apk file under,
your_project\platforms\android\build\outputs\apk\

You might also need to sign the apk
1) jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore yourkey.keystore android-release-unsigned.apk yourkey_alias_name
2) zipalign -v 4 android-release-unsigned.apk noname.apk
3) apksigner verify noname.apk


**Tips**

If you had a following error,
typescript: ...ng_tfjsmnist/node_modules/@tensorflow/tfjs-converter/dist/data/compiled_api.d.ts, line: 237
             Cannot find name 'Long'.

      L236:              /** Dim size */
      L237:              size?: (number|Long|null);

then, open compiled_api.d.ts file add following line.      
      
import * as $protobuf from "protobufjs";

import * as Long from "long"; // add this line


**Useful command**

To see general environment info

ionic info

To see installed package info

npm list

npm list --depth=0

To see installed specific package info, for instance if you want to see tfjs version info, run one of following command


npm info tfjs version

npm view tfjs version

npm show tfjs version

npm v tfjs version
