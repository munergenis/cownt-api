intervals de parts de cada vaca

vacaData {
longCode: string,\*
shortCode: string,
breed: string, (enum) [Xarolesa, Llimosina, Salers, Creuada] (nova coleccio)
sex: string, (enum) [M, F]
birthDate: string | null,
weight: string,
origin: string, (enum) [bought, born]
cost: num | null,
sale: num | null,
absence: string | null, (enum) [dead, sold]
characteristics: string[], (enum) [mal caracter, mala llet, berguer gros, coixera] (nova coleccio)

father: ref | null,
mother: ref | null,
children: ref[]

}

vacaData(reunio) {
x-codiLlarg: (son diferents, no tots iguals)
x-codiCurt (ultims 4 numeros codiLlarg) (poden repetirse. si es repeteixen el llarg es diferent)
x-raça:
x-sexe:
x-dataNaixament:
x-caracteristiques: [mal caracter, mala llet, berguer gros (tetes), coixeres]
births: [{data, codiLlarg, toro (opcional)}, ...]
x-present {
true/false
motiu: mort, venta, etc
}
}

vacaNoQuedada {
x-pes: per edat (es pesa el dia que es ven)
}

vacaActions: {
crear (neix o compra)
editar
registrarPart (aquesta accio es un POST a cows on ja es passa amb la info de la nova vaca, l'id de la vacaMare i la id del pare (s'ha de seleccionar d'un llistat))

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
