# Date daveti ♡

Canlı site: https://wh4l.github.io/date-daveti/

GitHub deposu: https://github.com/wh4l/date-daveti

Siteyi istediğin kişiye canlı site bağlantısıyla gönderebilirsin. Davetlinin seçtiği etkinlik, tarih, saat ve varsa etkinliğe özel isteği, Google E-Tablo'daki **Yanıtlar** sekmesine kaydedilir. İstek alanı boşsa tabloya "Seçim bana bırakıldı" yazılır. Tablo yalnızca senin Google hesabında bulunur; paylaşım ayarlarını değiştirmedik.

"Evet" yanıtından sonra **Çiçekleri aç** düğmesi, hareketli ASCII zambak buketini sitenin içinde ayrı bir pencerede gösterir. Buketi açmak tabloya kayıt göndermez; aynı pencere davetiye kartından tekrar açılabilir.

## Siteyi sonradan düzenleme

Masaüstündeki bu klasör kaynak dosyaların bir kopyasıdır. Burada yaptığın değişiklikler GitHub'a otomatik gitmez. Tarayıcı üzerinden güncellemek için GitHub deposunda ilgili dosyayı aç, kalem simgesiyle düzenle ve **Commit changes** seç. Dosyayı bilgisayardan yükleyeceksen depodaki **Add file → Upload files** yolunu kullan. GitHub Pages, `main` dalının kök klasöründen otomatik yayın yapar.

`config.js` dosyası kayıt bağlantısını içerir. Google Apps Script dağıtımını değiştirirsen buradaki bağlantıyı ve GitHub'daki `config.js` dosyasını eşitle. Tarayıcı eski dosyayı önbellekten getirirse `index.html` içindeki `config.js?v=2` sürümünü artır.

## Dosyalar

- `index.html`: sayfa ve davetiye adımları
- `style.css`: görünüm ve zarf animasyonu
- `app.js`: butonlar, konfeti, form ve kayıt gönderimi
- `bouquet.js`: davetiyedeki düğmeden açılan hareketli ASCII zambak penceresi
- `bouquet-source.png`: karakterlerle çizilen buketin renk ve şekil kaynağı; ziyaretçiye düz resim olarak gösterilmez
- `config.js`: Google Apps Script kayıt bağlantısı
- `favicon.svg`: kalp simgesi
- `backend/Code.gs`: Google E-Tablo'ya kayıt yapan Apps Script kodu
- `.nojekyll`: GitHub Pages ayarı

Kayıt uygulaması, Google hesabın adına çalışır ve bağlantıyı bilen herkes yanıt gönderebilir. Kodu yalnızca seçilen yanıtları tabloya ekler; tabloyu ziyaretçilere göstermez. Bu yöntem özel ve küçük çaplı bir davet için uygundur.
