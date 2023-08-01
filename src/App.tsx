import React, {useState, useCallback, useRef, useEffect} from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

// Уточнил тип Address для правильной типизации
type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
};

type Company = {
    bs: string;
    catchPhrase: string;
    name: string;
};

type User = {
    id: number;
    email: string;
    name: string;
    phone: string;
    username: string;
    website: string;
    company: Company;
    address: Address;
};

// Уточнил типы для пропсов
interface IButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    //Добавил состояние для кнопки (нерабочее/рабочее)
    disabled: boolean;
}

// Дал кнопке свойство "disabled" и обернул в React.memo для предотвращения ненужных рендеров
const Button = React.memo(({onClick, disabled}: IButtonProps) => {
    return (
        <button type="button" onClick={onClick} disabled={disabled}>
            get random user
        </button>
    );
});

// Уточнил типы для пропсов, включил null
interface IUserInfoProps {
    user: User | null;
}

// UserInfo обернут в React.memo для предотвращения ненужных рендеров, включил проверку на null
const UserInfo = React.memo(({user}: IUserInfoProps) => {
    if (user === null) return null;

    return (
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Phone number</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{user.name}</td>
                <td>{user.phone}</td>
            </tr>
            </tbody>
        </table>
    );
});

function App(): JSX.Element {
    const [item, setItem] = useState<User | null>(null);
    // Добавил кэш для хранения уже загруженных пользователей
    const [cache, setCache] = useState<Record<number, User>>({});
    // Добавил стейт для блокировки кнопки
    const [buttonDisabled, setButtonDisabled] = useState(false);
    // Добавил таймаут для блокировки кнопки
    const buttonTimeout = useRef<NodeJS.Timeout | null>(null);

    // Использовал useCallback для оптимизации функции получения случайного пользователя
    const receiveRandomUser = useCallback(async () => {
        setButtonDisabled(true);
        const id = Math.floor(Math.random() * (10 - 1)) + 1;
        // Использую кэш, если пользователь уже был загружен
        if (cache[id]) {
            setItem(cache[id]);
            // После использования кэша кнопка снова становится доступной
            setButtonDisabled(false);
            return;
        }

        try {
            const response = await fetch(`${URL}/${id}`);
            const user = (await response.json()) as User;
            // Если пользователь новый, сохраняю его в кэше
            setCache((prevCache) => ({...prevCache, [id]: user}));
            setItem(user);
        } catch (error) {
            console.error(error);
        }

        // Установил задержку для блокировки кнопки
        buttonTimeout.current = setTimeout(() => {
            setButtonDisabled(false);
        }, 2000);
    }, [cache]);

    // Использовал useCallback для оптимизации обработчика клика по кнопке
    const handleButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            receiveRandomUser();
        },
        [receiveRandomUser]
    );

    // Очищаю таймер при размонтировании компонента
    useEffect(() => {
        return () => {
            if (buttonTimeout.current) {
                clearTimeout(buttonTimeout.current);
            }
        };
    }, []);

    return (
        <div>
            <header>Get a random user</header>
            <Button onClick={handleButtonClick} disabled={buttonDisabled}/>
            <UserInfo user={item}/>
        </div>
    );
}

export default App;
