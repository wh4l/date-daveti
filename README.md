# Date daveti ♡

Tek sayfalık, telefonda ve bilgisayarda çalışan bir buluşma daveti. `index.html` dosyasını çift tıklayarak görünümü hemen açabilirsin. **Seçimlerin sana ulaşması için aşağıdaki Google E-Tablo kurulumunu tamamlaman gerekir.** Site yalnızca GitHub Pages'e konulursa yanıtları kaydedemez.

## 1. Seçimleri Google E-Tablo'ya kaydet

1. [Google E-Tablolar](https://sheets.google.com) içinde boş bir tablo oluştur. Adı örneğin **Date Daveti Yanıtları** olsun.
2. Üst menüden **Uzantılar → Apps Script** yolunu aç.
3. Editördeki örnek kodu sil. Bu klasördeki `backend/Code.gs` dosyasının tamamını yapıştır ve kaydet.
4. **Dağıt → Yeni dağıtım** seç. Tür olarak **Web uygulaması** seç.
5. **Şu kişi olarak yürüt: Ben**; **Kimler erişebilir: Herkes** seç. Bu ayar, davet ettiğin kişinin Google hesabıyla giriş yapmasını gerektirmez. Yetki ekranı çıkarsa kendi hesabınla onayla.
6. Dağıtım sonunda verilen, `https://script.google.com/macros/s/.../exec` biçimindeki **Web uygulaması URL'sini** kopyala. `/dev` ile biten test bağlantısını kullanma.
7. `config.js` dosyasındaki `endpoint: ""` alanına bağlantıyı tırnakların arasında yapıştır. Örnek: `endpoint: "https://script.google.com/macros/s/AKfycb.../exec"`.
8. URL'yi tarayıcıda açtığında **“Date daveti kayıt noktası hazır.”** yazması gerekir. Sonra siteden örnek bir yanıt verip Google E-Tablo'daki **Yanıtlar** sekmesinde satırın oluştuğunu kontrol et.

Bu bağlantı site kodunda görünür; herkese açık bir davet sitesi için normaldir. Tablo içeriği yalnızca senin Google hesabında kalır. Bağlantıyı bilen biri sahte yanıt gönderebilir; bu yüzden bu yöntemi özel ve küçük çaplı bir davet için kullan. Ad alanı isteğe bağlıdır. Yanıt başına bir Davet ID kaydedilir; aynı kişi davetiyeyi düzenlerse aynı satır güncellenir. Site, Google'ın tarayıcıya kapalı yanıtı nedeniyle kaydın başarılı olduğunu kesin olarak okuyamaz; testte tabloyu kontrol et.

## 2. GitHub'a yükle ve yayınla

GitHub hesabınla giriş yap. Bu klasör yerel bir Git deposu olarak hazırlanmıştır, bu yüzden [GitHub Desktop](https://desktop.github.com/) ile kolayca yükleyebilirsin:

1. GitHub Desktop'ta **File → Add local repository** seç ve Masaüstü'ndeki `date-daveti` klasörünü göster.
2. Sol altta değişiklikler görünüyorsa **Commit to main** yap. Ardından üstteki **Publish repository** düğmesine bas.
3. Repo adı `date-daveti` olabilir. GitHub Pages'i ücretsiz kullanacaksan **Keep this code private** işaretini kaldır, sonra **Publish repository** seç.
4. GitHub'da repoyu aç: **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Branch olarak `main`, klasör olarak `/(root)` seçip kaydet.
5. GitHub aynı sayfada **Visit site** bağlantısını gösterecek. Adres genellikle `https://KULLANICI-ADIN.github.io/date-daveti/` olur. **Gerçek bağlantı ancak repoyu yayınladığında belli olur.** Yayın birkaç dakika sürebilir.
6. Bağlantıyı özel olarak istediğin kişiye gönder. Önce telefonda açıp bir deneme yanıtı bırak ve tablodaki kaydı kontrol et.

Sonradan bir dosyayı değiştirirsen GitHub Desktop'ta yeni bir commit yapıp **Push origin** düğmesine basman yeterli. `config.js` dosyasına gerçek bağlantıyı girdikten sonra bunu da commit edip göndermeyi unutma.

## Dosyalar

- `index.html`: sayfa ve tüm adımlar
- `style.css`: renkler, mobil görünüm ve zarf animasyonu
- `app.js`: butonlar, konfeti, form ve kayıt gönderimi
- `config.js`: Google Apps Script bağlantısı
- `favicon.svg`: tarayıcı sekmesindeki kalp simgesi
- `backend/Code.gs`: Google E-Tablo'ya kayıt yapan kod
- `.nojekyll`: GitHub Pages'in dosyaları doğrudan yayınlaması için

GitHub Pages statik barındırmadır; ziyaretçi yanıtları GitHub'daki depoya yazılmaz. Tablo kurulana kadar davetiye görünür ama seçimler sana ulaşmaz.
