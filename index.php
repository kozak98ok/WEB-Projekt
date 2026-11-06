<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Poslední případ – inspektor Klepeto</title>
    <meta name="description" content="Poslední případ inspektora Klepeta: pláž, kraby a jedna ukradená ponožka.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:wght@600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css.css" rel="stylesheet">
</head>
<body>

<!-- Efekty: kraby v pozadí, běžící kraby a výbuchy -->
<canvas class="fx-canvas" id="fx-scene" aria-hidden="true"></canvas>
<canvas class="fx-canvas" id="fx-crabs" aria-hidden="true"></canvas>
<canvas class="fx-canvas" id="fx-walkers" aria-hidden="true"></canvas>
<canvas class="fx-canvas" id="fx-bombs" aria-hidden="true"></canvas>
<div class="ultra-text" id="ultra-text" aria-hidden="true">ULTRA KRÁDEŽ</div>

<div class="page-shell">

    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="#top">Poslední případ</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
                    aria-controls="mainNav" aria-expanded="false" aria-label="Přepnout navigaci">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" aria-current="page" href="#top">Místo činu</a></li>
                    <li class="nav-item"><a class="nav-link" href="#po-setmeni">Po setmění</a></li>
                    <li class="nav-item"><a class="nav-link" href="#dovednosti">Metody</a></li>
                    <li class="nav-item"><a class="nav-link" href="#projekty">Spisy</a></li>
                    <li class="nav-item"><a class="nav-link" href="#kontakt">Nahlásit zločin</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <header class="hero" id="top">
        <h1>Poslední případ</h1>
        <p>Jmenuju se inspektor Klepeto a za týden jdu do penze. Zbývá jedna pláž, jedna ukradená levá ponožka a hejno krabů, kteří všechno viděli, ale mlčí. Klidně je vyslechni tlačítkem.</p>
        <div class="rule"></div>
        <button type="button" class="btn-ultra" id="ultra-btn">Zahájit zatčení</button>
    </header>

    <main>
        <div class="row" id="po-setmeni">
            <div class="col-sm-8">
                <section class="panel">
                    <h2>O čem se po desáté večer nemluví</h2>
                    <p>Po desáté se nesmí mluvit o tom, že mraky jsou jen pára. Mraky to slyší. Když jsem to v roce 2019 řekl nahlas, začala mi každou středu chodit poštou jedna ponožka. Vždycky levá. Nikdy jsem ji neobjednal a dodnes nevím, kdo ji posílá.</p>
                    <p>Taky se nesmí vyslovit slovo „vteřina“ dvakrát za sebou, protože se tím probouzí Velký Krab Pod Ledničkou. Je to starý a unavený krab. Chce jen klid, pár drobků a aby se mu nikdo nedíval na klepeta. Kdo se mu podívá, tomu do rána ukradne jednu hlásku z abecedy. Já přišel o „ř“. Proto teď říkám „třicet třři“.</p>
                    <p class="mb-0">A hlavně nikdy, ale opravdu nikdy, nevyprávěj večer na pláži vtip o housce. Houska se pozná a houska si pamatuje. Pokud slyšíš za zády šustění pytlíku, neotáčej se. Řekni pomalu „dobrý večer, paní Housková“ a odejdi pozpátku.</p>
                </section>
            </div>
            <div class="col-sm-4">
                <aside class="panel">
                    <h3>Zakázaná témata</h3>
                    <ul class="mb-0 ps-3">
                        <li>Mraky (že jsou pára)</li>
                        <li>Vteřina, vteřina</li>
                        <li>Vtipy o housce</li>
                        <li>Co dělá vlnitý papír, když se nikdo nedívá</li>
                        <li>Levé ponožky</li>
                    </ul>
                </aside>
            </div>
        </div>

        <div class="row" id="dovednosti">
            <div class="col-md-4">
                <article class="story-card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Výslech svědků</h3>
                        <p class="card-text mb-0">Svědci jsou převážně kraby, racci a jedna houska. Mluví jen v noci a odpovídají otázkou.</p>
                    </div>
                </article>
            </div>
            <div class="col-md-4">
                <article class="story-card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Sledování</h3>
                        <p class="card-text mb-0">Sedím v křoví s dalekohledem a čekám, až se ponožka pohne. Zatím se nepohnula. Dívá se na mě.</p>
                    </div>
                </article>
            </div>
            <div class="col-md-4">
                <article class="story-card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Důkazní materiál</h3>
                        <p class="card-text mb-0">Jedna ponožka (levá), tři drobky od Velkého Kraba a dopis, který si sám sebe přečetl.</p>
                    </div>
                </article>
            </div>
        </div>

        <div class="row" id="projekty">
            <div class="col-12">
                <article class="story-card">
                    <div class="card-body">
                        <h2 class="card-title">Spisy: otevřené případy</h2>
                        <p class="card-text mb-0">Případ č. 1: Zmizelé „ř“. Případ č. 2: Kdo každou středu posílá poštou ponožky. Případ č. 3: Proč paní Housková všechno ví. Všechny tři vedou k téže lednici. Poslední případ je ten, který nikdo neotevře.</p>
                    </div>
                </article>
            </div>
        </div>

        <div class="row" id="kontakt">
            <div class="col-12">
                <article class="story-card">
                    <div class="card-body">
                        <h2 class="card-title">Nahlásit zločin</h2>
                        <p class="card-text mb-0">Pošli holubem, nebo e-mailem: <a class="contact-link" href="https://mail.google.com/">klepeto@posledni-pripad.cz</a><br>
                            Anonymní tip: <a class="contact-link" href="https://github.com/" target="_blank" rel="noopener">github.com/inspektor-klepeto</a></p>
                    </div>
                </article>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <p><span class="footer-brand">Poslední případ</span> &copy; <span id="year">2026</span>. Vše, co řekneš, může být použito proti krabům.</p>
    </footer>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
<script src="kraby.js" defer></script>
</body>
</html>