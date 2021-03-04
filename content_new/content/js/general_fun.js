var runs= function () {
                return fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed").then((function (e) {
                        return e.text()
                    }))
            }
console.log(runs);