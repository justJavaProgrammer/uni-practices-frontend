// app.js
// Бонусне завдання: інтерактивність за допомогою JavaScript

// Вибираємо кнопку за її ID
const btn = document.getElementById("bonus-btn");

if (btn) {
    btn.addEventListener("click", () => {
        // Зберігаємо старий текст кнопки
        const oldText = btn.textContent;
        
        // Змінюємо текст на новий
        btn.textContent = "ТИ НАТИСНУВ(ЛА) МЕНЕ!! ❤";
        
        // Повертаємо старий текст через 1 секунду
        setTimeout(() => {
            btn.textContent = oldText;
        }, 1000);
    });
}
