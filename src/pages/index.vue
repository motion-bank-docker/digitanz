<template lang="pug">
  q-page
    // q-scroll-observable(@scroll="scrollingHandler")

    q-page-sticky.z-top.q-pb-md.transition(position="bottom", :class="{'opacity-0': textOpacity}")
      q-btn.text-weight-regular.text-grey-9.bg-grey-1.q-mx-sm.q-px-lg(@click="smoothScroll('down')", flat, rounded, no-caps, size="lg") Info
      q-btn.text-weight-regular.text-grey-9.bg-grey-1.q-mx-sm.q-px-lg(@click="$router.push({path: '/tools'})", flat, rounded, no-caps, size="lg") Tools

    // ------------------------------------------------------------------------------------------------------ teaser-img
    .fixed-top.bg-grey-3
      .row.items-end(:style="{height: '100vh'}")
        .fit.text-center
          .fit.transition(style="background: url('statics/003-master-3.svg'); background-size: contain; background-repeat: no-repeat; background-position: center center; transform: scale(.9);",
          :class="{'opacity-0': textOpacity}")

    // ----------------------------------------------------------------------------------------------------- description
    .row.line-height-wider(style="margin-top: 100vh;")

      .row.z-top.full-height(style="min-height: 100vh;")

        .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.text-grey-9

          #infotext.q-px-md.q-mr-md.q-subheading.text-weight-regular.q-pt-md(style="line-height: 1.7rem;")
            div.q-mb-md.hyphens
              | Die in dieser App versammelten Tools sind für den Einsatz in der Tanzvermittlung gedacht. Zu jedem Tool finden Sie in der App einige Beispiele für deren Einsatz. Darüber hinaus sind natürlich noch vielfältige andere Nutzungsformen denkbar.
            div.q-mb-md.hyphens
              | Die einzelnen Tools sind ein Auszug aus einer für den Kontext Tanzvermittlung mit Jugendlichen entwickelten App, die im Forschungsprojekt #digitanz zum Einsatz kam. Das Kooperationsprojekt zwischen der Johannes Gutenberg-Universität Mainz und der Hochschule Mainz fragt danach, inwieweit digitale Technologien kreative Prozesse im Tanz anregen und bereichern können.
            div.q-mb-md.hyphens
              | Gleichzeitig werden neue Herausforderungen hinsichtlich der Aspekte Unterrichtsmethoden, Tanzverständnisse und Tanzästhetiken sowie Umgangsweisen mit dem eigenen (und fremden) Körper, Bewegungen und digitalen Medien untersucht.  Das Projekt #digitanz findet im Rahmen der Förderlinie „Forschung zur Digitalisierung in der kulturellen Bildung“ des BMBF statt.
              | Wir danken dem Tanzstudio Sabine Odenthal in Hürth für die Unterstützung der Filmaufnahmen.
            div.text-center.q-pt-md
              q-btn.text-weight-regular.text-grey-9.bg-grey-1.q-mx-sm.q-px-lg(@click="$router.push({path: '/tools'})", flat, rounded, no-caps, size="lg") Tools

        .row.full-width.bg-white.q-my-xl
          .row.col-12.items-center.q-px-lg.q-py-md
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="~assets/BMBF_deutsch.jpg", style="max-height: 80px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/logo-jgu.svg", style="max-height: 50px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/HSM_Logo_G_schwarz_klein_bold_regular.png", style="max-height: 30px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/motionbank_logo.svg", style="max-height: 40px;")

        // ------------------------------------------------------------------------------------------------- description
        // div.bg-grey-3.text-grey-9.full-width.q-px-md.q-pb-md
        #imprint.row.col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.text-grey-9.q-pb-md.q-px-md.hyphens
            q-collapsible.full-width(label="Impressum")
              div
                h6 digitanz lite (lite.digitanz.de)
                | Hochschule Mainz
                | Fachrichtung Kommunikationsdesign / Projekt Motion Bank
                | Holzstrasse 36, 55116 Mainz
                | Telefon: +49 (0) 61 31 - 628-2211
                | E-Mail: florian.jenett (at) hs-mainz.de

              div
                b Gesetzlicher Vertreter
                |
                | Präsident der Hochschule, Prof. Dr.-Ing. Gerhard Muth

              div
                b Zuständige Aufsichtsbehörde
                |
                | Ministerium für Wissenschaft
                | Weiterbildung und Kultur des Landes Rheinland-Pfalz
                | Mittlere Bleiche 61
                | 55116 Mainz

              div Verantwortliche I. S. D. § 55 ABS. 2 RFSTV: Prof. Dr.-Ing. Gerhard Muth

              div Copyright: Hochschule Mainz, Projekt Motion Bank sowie die Autoren von Text und Bild.

              div Rechtlicher Hinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschlie?lich deren Betreiber zuständig.

              div Haftungsausschluss: Mit Urteil vom 12. Mai 1998 hat das Landgericht Hamburg entschieden, dass man durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf. mit zu verantworten hat. Dies kann - so das LG - nur dadurch verhindert werden, dass man sich ausdr?cklich von diesen Inhalten distanziert. Der Studiengang Kommunikationsdesign der Hochschule Mainz hat auf ihrer Website Links zu anderen Seiten im Internet gelegt. F?r alle diese Links gilt: Es wird ausdr?cklich betont, dass der Studiengang Kommunikationsdesign der Hochschule Mainz keinerlei Einfluss auf die Gestaltung und die Inhalte der verlinkten Seiten hat. Deshalb distanziert sich der Studiengang Kommunikationsdesign der Hochschule Mainz hiermit ausdrücklich von allen Inhalten aller gelinkten Seiten auf dieser Homepage und macht sich ihre Inhalte nicht zueigen. Diese Erklärung gilt für alle auf dieser Homepage ausgebrachten Links. Alle genannten Warenzeichen und Marken sind Besitz ihrer jeweilig registrierten Eigent?mer.

              div
                h6 Datenschutz

              div
                b Verantwortlicher
                |
                | Präsident der Hochschule Mainz
                | Lucy-Hillebrand-Str. 2
                | 55218 Mainz
                | praesident (at) hs-mainz.de

              div
                b Datenschutzbeauftragte
                |
                | Datenschutzbeauftragte der Hochschule Mainz
                | Lucy-Hillebrand-Str. 2
                | 55218 Mainz
                | datenschutz (at) hs-mainz.de

              div
                b ERHEBUNG UND SPEICHERUNG PERSONENBEZOGENER DATEN SOWIE ART UND ZWECK DER VERWENDUNG BEIM BESUCH DER WEBSITE
                |
                | Beim Aufrufen unserer Website www.hs-mainz.de werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sog. Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:

                ul
                  li IP-Adresse des anfragenden Rechners
                  li Datum und Uhrzeit des Zugriffs
                  li Name und URL der abgerufenen Datei
                  li Website, von der aus der Zugriff erfolgt (Referrer-URL)
                  li verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers
              div
                | Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
                ul
                  li Gewährleistung eines reibungslosen Verbindungsaufbaus der Website
                  li Gewährleistung einer komfortablen Nutzung unserer Website
                  li Auswertung der Systemsicherheit und -stabilität sowie zu weiteren administrativen Zwecken.

              div
                | Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DS-GVO. Unser berechtigtes Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung. In keinem Fall verwenden wir die erhobenen Daten zu dem Zweck, Rückschlüsse auf Ihre Person zu ziehen.
                | Darüber hinaus setzen wir beim Besuch unserer Website Cookies sowie Analysedienste ein. Nähere Erläuterungen dazu erhalten Sie weiter unten in dieser Datenschutzerklärung.

              div
                b WEITERGABE VON DATEN
                |
                | Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt.
                | Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DS-GVO eine gesetzliche Verpflichtung besteht.

              div
                b COOKIES
                |
                | Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät (Laptop, Tablet, Smartphone o.ä.) gespeichert werden, wenn Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen Schaden an, enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
                | In dem Cookie werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer Identität erhalten.
                | Zum anderen setzten wir Cookies ein, um die Nutzung unserer Website statistisch zu erfassen und zum Zwecke der Optimierung unseres Angebotes für Sie auszuwerten. Diese Cookies ermöglichen es uns, bei einem erneuten Besuch unserer Seite automatisch zu erkennen, dass Sie bereits bei uns waren. Diese Cookies werden nach einer jeweils definierten Zeit automatisch gelöscht.
                | Die durch Cookies verarbeiteten Daten sind für die genannten Zwecke zur Wahrung unserer berechtigten Interessen sowie der Dritter nach Art. 6 Abs. 1 S. 1 lit. f DS-GVO erforderlich.
                | Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren Browser jedoch so konfigurieren, dass keine Cookies auf Ihrem Computer gespeichert werden oder stets ein Hinweis erscheint, bevor ein neuer Cookie angelegt wird. Die vollständige Deaktivierung von Cookies kann jedoch dazu führen, dass Sie nicht alle Funktionen unserer Website nutzen können.

              div
                b VERWEISE ZU SOCIAL MEDIA ANBIETER
                |
                | Die Verweise sind im Rahmen unseres Internetauftritts jeweils durch das Logo des Anbieters kenntlich gemacht. Social Plugins werden nicht eingesetzt. Bei Ihrem Besuch auf unseren Webseiten mit den Verweisen zu den sozialen Netzwerken werden also keine Daten an Dritte übermittelt. Erst wenn Sie die Webseite des Social Media Dienstes aufgerufen und sich bei diesem Dienst registriert oder angemeldet haben, erfolgt eine Übertragung der Daten.
                | Wir tragen keine Verantwortung dafür, ob die Betreiber der Social Media Plattformen die gesetzlichen Datenschutzbestimmungen einhalten.

              div
                b BETROFFENENRECHTE:
                |
                | gemäß Art. 15 DS-GVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten, die Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer, das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie über das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und ggf. aussagekräftigen Informationen zu deren Einzelheiten verlangen;
                | gemäß Art. 16 DS-GVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;
                | gemäß Art. 17 DS-GVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist;
                | gemäß Art. 18 DS-GVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DS-GVO Widerspruch gegen die Verarbeitung eingelegt haben;
                | gemäß Art. 20 DS-GVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen;
                | gemäß Art. 7 Abs. 3 DS-GVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen dürfen und
                | gemäß Art. 77 DS-GVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Vereinssitzes wenden.
                | Sie haben das Recht, Ihre datenschutzrechtliche Einwilligungserklärung jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.

              div
                b RECHT AUF BESCHWERDE BEI EINER AUFSICHTSBEHÖRDE
                |
                | Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, zu, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DS-GVO verstößt.
                | Das Beschwerderecht gemäß Artikel 13 DS-GVO ist bei der für die Hochschule Mainz zuständigen Aufsichtsbehörde geltend zu machen:

              div
                b Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz
                |
                | LfDI
                | Postfach 3040
                | 55020 Mainz
</template>

<script>
  import { mapGetters } from 'vuex'

  import * as pkg from '../../package.json'
  export default {
    data () {
      return {
        name: pkg.name,
        version: pkg.version,
        // scrolled: false,
        // mrGriddleOpacity: 1,
        // mrGriddleOffset: 0,
        scrollY: 0
      }
    },
    computed: {
      ...mapGetters({
        deviceDimensions: 'globalSettings/getDeviceDimensions',
        scrollPosition: 'globalSettings/getScrollPosition'
      }),
      mrGriddleOffset () {
        return (this.scrollPosition.y / -5).toFixed(2)
      },
      mrGriddleOpacity () {
        return 1 / (this.scrollPosition.y / 250)
      },
      textOpacity () {
        // return this.scrollPosition.y > this.deviceDimensions.height * 0.34 + 48
        return this.scrollPosition.y > 30
      }
    },
    methods: {
      scrollingHandler () {
        // scroll.position > 10 ? this.scrolled = true : this.scrolled = false
        // this.mrGriddleOpacity = 1 / (scroll.position / 250)
        // this.mrGriddleOffset = (this.scrollPosition.y / -5).toFixed(2)
        // this.scrollY = scroll.position
      },
      smoothScroll (direction) {
        console.log(direction)
        let distance
        if (direction === 'down') distance = this.deviceDimensions.height
        else distance = 0
        window.scroll({
          top: distance,
          behavior: 'smooth'
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .hide-arrow
    /*opacity 0*/
    /*margin-bottom -100px*/
    button
      opacity 0

  #imprint
    div:not(:last-of-type)
      margin-bottom 2rem

    div
      white-space pre-line

    h6
      margin-bottom 1em
      margin-top 1em

  #infotext
    a
      color #222
</style>
