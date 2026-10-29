Feature: Gestion de alarmas

  Scenario: Abrir la seccion de alarmas
    Given que la aplicacion Reloj esta abierta
    When ingreso a la seccion de alarmas
    Then deberia ver el boton para agregar una alarma