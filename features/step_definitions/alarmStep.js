const { Given, When, Then } = require('@wdio/cucumber-framework');
const alarmPage = require('../../pageObjects/alarmPage');

Given('que la aplicacion Reloj esta abierta', async () => {
    await alarmPage.alarmTab.waitForDisplayed({
        timeout: 15000
    });
});

When('ingreso a la seccion de alarmas', async () => {
    await alarmPage.openAlarmTab();
});

Then('deberia ver el boton para agregar una alarma', async () => {
    await expect(alarmPage.addButton).toBeDisplayed();
    await browser.takeScreenshot();
});