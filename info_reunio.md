intervals de parts de cada vaca

vacaData {
  codiLlarg:
  codiCurt (ultims 4 numeros codiLlarg) (poden repetirse)
  raça:
  sexe:
  dataNaixament:
  caracteristiques: [mal caracter, mala llet, berguer gros (tetes), coixeres]
  births: [{data, codiLlarg, toro (opcional)}, ...]
  present {
    true/false
    motiu: mort, venta, etc
  }
}

vacaNoQuedada {
  pes: per edat (es pesa el dia que es ven)
}

vacaActions: {
  crear (neix o compra)
  editar
  registrarPart

}

avis de vaca no pareix fa X mesos (x editable)

accio per determinar que ja tenen edat de reproduirse amb el toro

ordre de view cows
per codi curt
per dataNaixament

ovellaData {
  igual que vaca
  codiCurt (ultims 5 numeros codiLlarg) (poden repetirse)
}

que fem amb toro
