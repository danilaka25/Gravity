
const z = require("zod");

const schema = z.object({
    jarUrl: z
        .string()
        .url("Неверная ссылка")
        .min(1, "Ссылка обязательна")
        .refine(
            (val) => val.startsWith("https://send.monobank.ua"),
            "Ссылка должна начинаться с https://send.monobank.ua"
        ),
    authorNickname: z
        .string()
        .min(1, "Ник обязателен")
        .regex(
            /^[a-zA-Zа-яА-ЯёЁ]+$/,
            "Ник автора только буквы рус и англ"
        ),
});

const runTests = () => {
    const cases = [
        {
            url: "https://send.monobank.ua/jar/123",
            name: "valid url",
            shouldPass: true,
        },
        {
            url: "https://google.com",
            name: "invalid domain",
            shouldPass: false,
        },
        {
            url: "http://send.monobank.ua/jar/123",
            name: "http instead of https",
            shouldPass: false,
        },
        {
            url: "send.monobank.ua/jar/123",
            name: "missing protocol",
            shouldPass: false,
        },
        {
            url: "https://send.monobank.ua",
            name: "exact match base",
            shouldPass: true,
        },
    ];

    let passed = 0;
    let failed = 0;

    cases.forEach((c) => {
        const result = schema.safeParse({ jarUrl: c.url, authorNickname: "Test" });
        const isSuccess = result.success;

        if (isSuccess === c.shouldPass) {
            console.log(`PASS: ${c.name}`);
            passed++;
        } else {
            console.log(`FAIL: ${c.name} - Expected ${c.shouldPass}, got ${isSuccess}`);
            if (!isSuccess) {
                console.log("Error:", result.error.errors[0].message);
            }
            failed++;
        }
    });

    console.log(`\nTotal: ${passed} passed, ${failed} failed`);
};

runTests();
