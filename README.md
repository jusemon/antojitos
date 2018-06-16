# Antojitos

Una aplicación de antojitos para Sarita y mi persona <3

## Para compilar
> $ quasar build -m cordova -T android

## Para firmar y alinear
> $ cd /src-cordova/platforms/android/app/build/outputs/apk/release

> $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $USERPROFILE/.keystore app-release-unsigned.apk alias_name

> $ $USERPROFILE/AppData/Local/Android/sdk/build-tools/26.0.3/zipalign -v -p 4 app-release-unsigned.apk app-release-aligned.apk