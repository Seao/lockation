<p align="center">
  <img src="./icons/icon128.png" width="100"><br>
  Keep your location private through obfuscation
</p>

# Lockation

This project has been developed in University context as a proof of concept and illustration for obfuscation techniques over GPS position. As the man in the middle attack, Lockation works by interposing itself between websites and the browser. It acts transparently by adding noise to the GPS positions exchanged.

## Privacy provided

Websites can request an access to your location through browser defined methods. Lockation provides privacy within a defined area by adding noise to your real position, making it less precise. The privacy level defined in options determines the amount of noise added to your real location. A noised position is privacy perserving, however location based services provided by websites would be less useful.

**Note :** Lockation does not cover websites which detect your location based on your IP address, attributed by your Internet Service Provider (ISP).

## Development
> Instructions to install the extension manually

Clone the repository through the following command :

```
git clone https://github.com/Seao/lockation.git
```

On Google Chrome browser, access `chrome://extensions` and enable the `developer mode`. Click the button `load unpacked extension` and select Lockation repository retrieved by the clone command.

Congrats, Lockation is ready for development ! 🎉
