Array.prototype.delete = function (num) {
    if (typeof num != "number") num = this.indexOf(num); // Если второй аргумент не число, то в массиве arr мы ищем элемент num и получаем его индекс.
    if (num == 0) {
        this.shift();
        return this;
    }
    this.splice(Number(num), 1) // Удаляем элемент.
    return this
};