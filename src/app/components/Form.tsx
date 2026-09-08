"use client";

import {
    PhotoIcon,
    UserCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";

interface UserData {
    id: number;
    username: string;
    about: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    hobby: string[];
    country: string;
    streetAddress: string;
    city: string;
    state: string;
    pinCode: string;
    photo: string;
    coverPhoto: string;
}

export default function Form() {
    const [username, setUsername] = useState("");
    const [about, setAbout] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [hobby, setHobby] = useState<string[]>([]);
    const [country, setCountry] = useState("");
    const [streetAddress, setStreetaddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pinCode, setPincode] = useState("");

    const [photo, setPhoto] = useState("");
    const [coverPhoto, setCoverPhoto] = useState("");

    const [users, setUsers] = useState<UserData[]>([]);
    const [editId, setEditId] = useState<number | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [search, setSearch] = useState("");

    const [sortField, setSortField] =
        useState<keyof UserData>("id");

    const [sortOrder, setSortOrder] =
        useState<"asc" | "desc">("asc");

    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 5;

    // =====================================================
    // LOAD USERS FROM LOCAL STORAGE
    // =====================================================

    useEffect(() => {
        try {
            const savedUserData =
                localStorage.getItem("Users");

            if (savedUserData) {
                const parsedUsers = JSON.parse(savedUserData);

                if (Array.isArray(parsedUsers)) {
                    setUsers(parsedUsers);
                }
            }
        } catch (error) {
            console.error(
                "Error loading users:",
                error
            );
        }
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredUsers = users.filter((u) => {
        const searchValue = search.toLowerCase();

        return (
            u.username.toLowerCase().includes(searchValue) ||
            u.firstName.toLowerCase().includes(searchValue) ||
            u.lastName.toLowerCase().includes(searchValue) ||
            u.email.toLowerCase().includes(searchValue) ||
            u.gender.toLowerCase().includes(searchValue) ||
            u.country.toLowerCase().includes(searchValue) ||
            u.city.toLowerCase().includes(searchValue) ||
            u.state.toLowerCase().includes(searchValue)
        );
    });

    // =====================================================
    // SORT
    // =====================================================

    const sortedUsers = [...filteredUsers].sort(
        (a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            if (Array.isArray(valueA)) {
                valueA = valueA.join("");
            }

            if (Array.isArray(valueB)) {
                valueB = valueB.join("");
            }

            if (
                typeof valueA === "string" &&
                typeof valueB === "string"
            ) {
                const result = valueA.localeCompare(
                    valueB,
                    undefined,
                    {
                        sensitivity: "base",
                    }
                );

                return sortOrder === "asc"
                    ? result
                    : -result;
            }

            if (
                typeof valueA === "number" &&
                typeof valueB === "number"
            ) {
                return sortOrder === "asc"
                    ? valueA - valueB
                    : valueB - valueA;
            }

            return 0;
        }
    );

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        sortedUsers.length / usersPerPage
    );

    const startIndex =
        (currentPage - 1) * usersPerPage;

    const paginatedUsers = sortedUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    // =====================================================
    // SORT FUNCTION
    // =====================================================

    const handleSort = (
        field: keyof UserData
    ) => {
        if (sortField === field) {
            setSortOrder(
                sortOrder === "asc"
                    ? "desc"
                    : "asc"
            );
        } else {
            setSortField(field);
            setSortOrder("asc");
        }

        setCurrentPage(1);
    };

    // =====================================================
    // HOBBY
    // =====================================================

    const handleHobby = (value: string) => {
        if (hobby.includes(value)) {
            setHobby(
                hobby.filter(
                    (h) => h !== value
                )
            );
        } else {
            setHobby([
                ...hobby,
                value,
            ]);
        }
    };

    // =====================================================
    // COMPRESS IMAGE
    // =====================================================

    const compressImage = (
        file: File,
        maxWidth = 800,
        quality = 0.7
    ): Promise<string> => {
        return new Promise(
            (resolve, reject) => {
                const reader =
                    new FileReader();

                reader.onload = () => {
                    const img =
                        new Image();

                    img.onload = () => {
                        let width =
                            img.width;

                        let height =
                            img.height;

                        if (
                            width >
                            maxWidth
                        ) {
                            height =
                                (height *
                                    maxWidth) /
                                width;

                            width =
                                maxWidth;
                        }

                        const canvas =
                            document.createElement(
                                "canvas"
                            );

                        canvas.width =
                            width;

                        canvas.height =
                            height;

                        const context =
                            canvas.getContext(
                                "2d"
                            );

                        if (!context) {
                            reject(
                                new Error(
                                    "Canvas not supported"
                                )
                            );

                            return;
                        }

                        context.drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                        );

                        const compressed =
                            canvas.toDataURL(
                                "image/jpeg",
                                quality
                            );

                        resolve(
                            compressed
                        );
                    };

                    img.onerror =
                        () => {
                            reject(
                                new Error(
                                    "Invalid image"
                                )
                            );
                        };

                    img.src =
                        reader.result as string;
                };

                reader.onerror =
                    () => {
                        reject(
                            new Error(
                                "Could not read image"
                            )
                        );
                    };

                reader.readAsDataURL(file);
            }
        );
    };

    // =====================================================
    // PROFILE PHOTO
    // =====================================================

    const handlePhotoChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setErrors((prev) => ({
                ...prev,
                photo:
                    "Please upload a valid image file!",
            }));

            return;
        }

        try {
            const compressedImage =
                await compressImage(
                    file,
                    500,
                    0.7
                );

            setPhoto(
                compressedImage
            );

            setErrors((prev) => {
                const updated = {
                    ...prev,
                };

                delete updated.photo;

                return updated;
            });
        } catch (error) {
            console.error(error);

            setErrors((prev) => ({
                ...prev,
                photo:
                    "Unable to process image!",
            }));
        }
    };

    // =====================================================
    // COVER PHOTO
    // =====================================================

    const handleCoverPhotoChange =
        async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file =
                e.target.files?.[0];

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    coverPhoto:
                        "Please upload a valid image file!",
                }));

                return;
            }

            try {
                const compressedImage =
                    await compressImage(
                        file,
                        800,
                        0.7
                    );

                setCoverPhoto(
                    compressedImage
                );

                setErrors((prev) => {
                    const updated = {
                        ...prev,
                    };

                    delete updated.coverPhoto;

                    return updated;
                });
            } catch (error) {
                console.error(error);

                setErrors((prev) => ({
                    ...prev,
                    coverPhoto:
                        "Unable to process image!",
                }));
            }
        };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {
        const newErrors: Record<
            string,
            string
        > = {};

        // Username
        if (!username.trim()) {
            newErrors.username =
                "Username is Required!";
        } else if (
            username.length < 3
        ) {
            newErrors.username =
                "Username must be at least 3 Characters!";
        } else if (
            username.length > 20
        ) {
            newErrors.username =
                "Username must not exceed 20 Characters!";
        } else if (
            !/^[A-Za-z0-9_]+$/.test(
                username
            )
        ) {
            newErrors.username =
                "Username Can contain only characters, number and underscore!";
        }

        // About
        if (!about.trim()) {
            newErrors.about =
                "About is Required!";
        } else if (
            about.trim().length < 30
        ) {
            newErrors.about =
                "About must be at least 30 Characters!";
        } else if (
            about.trim().length > 200
        ) {
            newErrors.about =
                "About must not exceed 200 Characters!";
        }

        // First Name
        if (!firstName.trim()) {
            newErrors.firstName =
                "First Name is Required!";
        } else if (
            !/^[A-Za-z ]+$/.test(
                firstName
            )
        ) {
            newErrors.firstName =
                "First Name Can contain only characters!";
        } else if (
            firstName.trim().length < 2
        ) {
            newErrors.firstName =
                "First Name must be at least 2 Characters!";
        }

        // Last Name
        if (!lastName.trim()) {
            newErrors.lastName =
                "Last Name is Required!";
        } else if (
            !/^[A-Za-z ]+$/.test(
                lastName
            )
        ) {
            newErrors.lastName =
                "Last Name Can contain only characters!";
        } else if (
            lastName.trim().length < 2
        ) {
            newErrors.lastName =
                "Last Name must be at least 2 Characters!";
        }

        // Email
        if (!email.trim()) {
            newErrors.email =
                "Email is Required!";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                email
            )
        ) {
            newErrors.email =
                "Please Enter Valid Email ID!";
        }

        // Password
        if (!password.trim()) {
            newErrors.password =
                "Password is Required!";
        } else if (
            password.length < 8
        ) {
            newErrors.password =
                "Password must be at least 8 Characters!";
        } else if (
            password.length > 16
        ) {
            newErrors.password =
                "Password must not exceed 16 Characters!";
        } else if (
            !/[A-Z]/.test(password)
        ) {
            newErrors.password =
                "Password must Contain at Least one Uppercase Letter!";
        } else if (
            !/[a-z]/.test(password)
        ) {
            newErrors.password =
                "Password must Contain at Least one Lowercase Letter!";
        } else if (
            !/[0-9]/.test(password)
        ) {
            newErrors.password =
                "Password must Contain at Least one number!";
        } else if (
            !/[!@#$%^&*_.-]/.test(
                password
            )
        ) {
            newErrors.password =
                "Password must Contain at Least one Special Character!";
        }

        // Gender
        if (!gender.trim()) {
            newErrors.gender =
                "Please Select Gender!";
        }

        // Hobby
        if (hobby.length === 0) {
            newErrors.hobby =
                "Please Select at least one Hobby!";
        }

        // Country
        if (!country) {
            newErrors.country =
                "Please Select a Country!";
        }

        // Street Address
        if (!streetAddress.trim()) {
            newErrors.streetAddress =
                "Street address is Required!";
        } else if (
            streetAddress.trim().length < 5
        ) {
            newErrors.streetAddress =
                "Street address must be at least 5 Characters!";
        }

        // City
        if (!city.trim()) {
            newErrors.city =
                "City is Required!";
        } else if (
            !/^[A-Za-z ]+$/.test(city)
        ) {
            newErrors.city =
                "City only Contain Characters and Space!";
        }

        // State
        if (!state.trim()) {
            newErrors.state =
                "State is Required!";
        } else if (
            !/^[A-Za-z ]+$/.test(state)
        ) {
            newErrors.state =
                "State only Contain Characters and Space!";
        }

        // PIN CODE
        if (!pinCode.trim()) {
            newErrors.pinCode =
                "Pincode is Required!";
        } else if (
            !/^\d{6}$/.test(pinCode)
        ) {
            newErrors.pinCode =
                "Please enter a valid 6-digit PIN code!";
        }

        // Profile Photo
        if (!photo) {
            newErrors.photo =
                "Please upload a profile photo!";
        }

        // Cover Photo
        if (!coverPhoto) {
            newErrors.coverPhoto =
                "Please upload a cover photo!";
        }

        setErrors(newErrors);

        return (
            Object.keys(
                newErrors
            ).length === 0
        );
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setUsername("");
        setAbout("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setGender("");
        setHobby([]);
        setCountry("");
        setStreetaddress("");
        setCity("");
        setState("");
        setPincode("");
        setPhoto("");
        setCoverPhoto("");
        setErrors({});
        setEditId(null);

        const photoInput =
            document.getElementById(
                "photo-upload"
            ) as HTMLInputElement;

        const coverInput =
            document.getElementById(
                "file-upload"
            ) as HTMLInputElement;

        if (photoInput) {
            photoInput.value = "";
        }

        if (coverInput) {
            coverInput.value = "";
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (
        user: UserData
    ) => {
        setEditId(user.id);

        setUsername(
            user.username
        );

        setAbout(user.about);

        setFirstName(
            user.firstName
        );

        setLastName(
            user.lastName
        );

        setEmail(user.email);

        setPassword(
            user.password
        );

        setGender(user.gender);

        setHobby(
            user.hobby ?? []
        );

        setCountry(
            user.country
        );

        setStreetaddress(
            user.streetAddress
        );

        setCity(user.city);

        setState(user.state);

        setPincode(
            user.pinCode
        );

        setPhoto(
            user.photo ?? ""
        );

        setCoverPhoto(
            user.coverPhoto ?? ""
        );

        setErrors({});

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (
        id: number
    ) => {
        const confirmDelete =
            window.confirm(
                "Are You sure you want to delete this Record?"
            );

        if (!confirmDelete) {
            return;
        }

        const updatedUsers =
            users.filter(
                (user) =>
                    user.id !== id
            );

        try {
            localStorage.setItem(
                "Users",
                JSON.stringify(
                    updatedUsers
                )
            );

            setUsers(
                updatedUsers
            );

            alert(
                "User Deleted Successfully!"
            );
        } catch (error) {
            console.error(error);

            alert(
                "Unable to update local storage."
            );
        }
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const isValid =
            validate();

        if (!isValid) {
            return;
        }

        // =================================================
        // ADD USER
        // =================================================

        if (editId === null) {
            const newUser: UserData = {
                id: Date.now(),
                username:
                    username.trim(),
                about:
                    about.trim(),
                firstName:
                    firstName.trim(),
                lastName:
                    lastName.trim(),
                email:
                    email.trim(),
                password,
                gender,
                hobby: [...hobby],
                country,
                streetAddress:
                    streetAddress.trim(),
                city:
                    city.trim(),
                state:
                    state.trim(),
                pinCode:
                    pinCode.trim(),
                photo,
                coverPhoto,
            };

            const updatedUsers = [
                ...users,
                newUser,
            ];

            try {
                localStorage.setItem(
                    "Users",
                    JSON.stringify(
                        updatedUsers
                    )
                );

                setUsers(
                    updatedUsers
                );

                alert(
                    "User Added Successfully!"
                );

                // IMPORTANT:
                // Reset ONLY after localStorage
                // successfully saves.
                resetForm();

                setCurrentPage(1);

                console.log(
                    "User added successfully"
                );
            } catch (error) {
                console.error(
                    "LocalStorage Error:",
                    error
                );

                alert(
                    "Unable to save user. Local storage is full. Please delete some old users."
                );
            }

            return;
        }

        // =================================================
        // UPDATE USER
        // =================================================

        const updatedUsers =
            users.map(
                (user) => {
                    if (
                        user.id ===
                        editId
                    ) {
                        return {
                            ...user,
                            username:
                                username.trim(),
                            about:
                                about.trim(),
                            firstName:
                                firstName.trim(),
                            lastName:
                                lastName.trim(),
                            email:
                                email.trim(),
                            password,
                            gender,
                            hobby: [
                                ...hobby,
                            ],
                            country,
                            streetAddress:
                                streetAddress.trim(),
                            city:
                                city.trim(),
                            state:
                                state.trim(),
                            pinCode:
                                pinCode.trim(),
                            photo,
                            coverPhoto,
                        };
                    }

                    return user;
                }
            );

        try {
            localStorage.setItem(
                "Users",
                JSON.stringify(
                    updatedUsers
                )
            );

            setUsers(
                updatedUsers
            );

            alert(
                "User Updated Successfully!"
            );

            resetForm();

        } catch (error) {
            console.error(
                "LocalStorage Error:",
                error
            );

            alert(
                "Unable to update user. Local storage is full."
            );
        }
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================= FORM ================= */}

            <div className="max-w-3xl mx-auto px-6 py-16">

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="rounded-xl bg-white border border-slate-200 px-8 py-10 sm:px-12 sm:py-12"
                >

                    <div className="space-y-14">

                        {/* PROFILE */}

                        <div className="border-b border-slate-200 pb-10">

                            <h2 className="font-serif text-2xl text-slate-800">
                                Profile
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                This information will be displayed publicly so be careful what you share.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-6">

                                {/* USERNAME */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            username
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        placeholder="janesmith"
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 text-base text-slate-800 focus:outline-none focus:border-slate-800 sm:text-sm"
                                    />

                                    {errors.username && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.username
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* ABOUT */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        About
                                    </label>

                                    <textarea
                                        rows={
                                            3
                                        }
                                        value={
                                            about
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setAbout(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Write a few sentences about yourself."
                                        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-800 focus:outline-none focus:border-slate-800 sm:text-sm"
                                    />

                                    {errors.about && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.about
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* PROFILE PHOTO */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Photo
                                    </label>

                                    <div className="mt-2 flex items-center gap-x-3">

                                        {photo ? (
                                            <img
                                                src={
                                                    photo
                                                }
                                                alt="Profile preview"
                                                className="size-12 rounded-full object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <UserCircleIcon className="size-12 text-slate-300" />
                                        )}

                                        <label
                                            htmlFor="photo-upload"
                                            className="cursor-pointer rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-800 hover:text-white"
                                        >
                                            {photo
                                                ? "Change"
                                                : "Upload"}

                                            <input
                                                id="photo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={
                                                    handlePhotoChange
                                                }
                                            />
                                        </label>

                                    </div>

                                    {errors.photo && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.photo
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* COVER PHOTO */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Cover photo
                                    </label>

                                    <label
                                        htmlFor="file-upload"
                                        className="mt-2 flex cursor-pointer justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10"
                                    >

                                        {coverPhoto ? (
                                            <div className="w-full text-center">

                                                <img
                                                    src={
                                                        coverPhoto
                                                    }
                                                    alt="Cover preview"
                                                    className="mx-auto max-h-32 rounded-lg object-cover"
                                                />

                                                <p className="mt-3 text-sm font-semibold text-amber-600">
                                                    Change cover photo
                                                </p>

                                            </div>
                                        ) : (
                                            <div className="text-center">

                                                <PhotoIcon className="mx-auto size-12 text-slate-300" />

                                                <div className="mt-4 text-sm text-slate-500">
                                                    <span className="font-semibold text-amber-600">
                                                        Upload a file
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-400 mt-1">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>

                                            </div>
                                        )}

                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={
                                                handleCoverPhotoChange
                                            }
                                        />

                                    </label>

                                    {errors.coverPhoto && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.coverPhoto
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>
                        </div>

                        {/* PERSONAL INFORMATION */}

                        <div className="border-b border-slate-200 pb-10">

                            <h2 className="font-serif text-2xl text-slate-800">
                                Personal Information
                            </h2>

                            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-6">

                                {/* FIRST NAME */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        First name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            firstName
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setFirstName(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none focus:border-slate-800"
                                    />

                                    {errors.firstName && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.firstName
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* LAST NAME */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Last name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            lastName
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setLastName(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none focus:border-slate-800"
                                    />

                                    {errors.lastName && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.lastName
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* EMAIL */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Email address
                                    </label>

                                    <input
                                        type="email"
                                        value={
                                            email
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none focus:border-slate-800"
                                    />

                                    {errors.email && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.email
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* PASSWORD */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            password
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none focus:border-slate-800"
                                    />

                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.password
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* GENDER */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Gender
                                    </label>

                                    <div className="flex mt-3 gap-6">

                                        <label>

                                            <input
                                                type="radio"
                                                value="Male"
                                                name="gender"
                                                checked={
                                                    gender ===
                                                    "Male"
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setGender(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span className="ml-2 text-sm">
                                                Male
                                            </span>

                                        </label>

                                        <label>

                                            <input
                                                type="radio"
                                                value="Female"
                                                name="gender"
                                                checked={
                                                    gender ===
                                                    "Female"
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setGender(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span className="ml-2 text-sm">
                                                Female
                                            </span>

                                        </label>

                                    </div>

                                    {errors.gender && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.gender
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* HOBBY */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Hobby
                                    </label>

                                    <div className="flex flex-wrap gap-4 mt-3">

                                        {[
                                            "Reading",
                                            "Writing",
                                            "Surfing",
                                            "Travelling",
                                            "Music",
                                        ].map(
                                            (
                                                item
                                            ) => (
                                                <label
                                                    key={
                                                        item
                                                    }
                                                >

                                                    <input
                                                        type="checkbox"
                                                        value={
                                                            item
                                                        }
                                                        checked={hobby.includes(
                                                            item
                                                        )}
                                                        onChange={() =>
                                                            handleHobby(
                                                                item
                                                            )
                                                        }
                                                    />

                                                    <span className="ml-2 text-sm">
                                                        {
                                                            item
                                                        }
                                                    </span>

                                                </label>
                                            )
                                        )}

                                    </div>

                                    {errors.hobby && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.hobby
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* COUNTRY */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Country
                                    </label>

                                    <select
                                        value={
                                            country
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setCountry(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 w-full border-b border-slate-300 py-2 bg-transparent focus:outline-none"
                                    >

                                        <option value="">
                                            Select Country
                                        </option>

                                        <option value="India">
                                            India
                                        </option>

                                        <option value="USA">
                                            United States
                                        </option>

                                        <option value="Canada">
                                            Canada
                                        </option>

                                        <option value="China">
                                            China
                                        </option>

                                        <option value="Russia">
                                            Russia
                                        </option>

                                        <option value="Mexico">
                                            Mexico
                                        </option>

                                    </select>

                                    {errors.country && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.country
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* STREET ADDRESS */}

                                <div className="sm:col-span-3">

                                    <label className="block text-sm font-medium text-slate-800">
                                        Street address
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            streetAddress
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setStreetaddress(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none"
                                    />

                                    {errors.streetAddress && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.streetAddress
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* CITY */}

                                <div className="sm:col-span-2">

                                    <label className="block text-sm font-medium text-slate-800">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            city
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setCity(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none"
                                    />

                                    {errors.city && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.city
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* STATE */}

                                <div className="sm:col-span-2">

                                    <label className="block text-sm font-medium text-slate-800">
                                        State / Province
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            state
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setState(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none"
                                    />

                                    {errors.state && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.state
                                            }
                                        </p>
                                    )}

                                </div>

                                {/* PIN CODE */}

                                <div className="sm:col-span-2">

                                    <label className="block text-sm font-medium text-slate-800">
                                        ZIP / Postal code
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            pinCode
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPincode(
                                                e.target.value
                                            )
                                        }
                                        className="mt-2 block w-full border-b border-slate-300 bg-transparent py-2 focus:outline-none"
                                    />

                                    {errors.pinCode && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {
                                                errors.pinCode
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>
                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-8 flex items-center justify-end gap-x-4 pt-6">

                        <button
                            type="button"
                            onClick={
                                resetForm
                            }
                            className="rounded-lg border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-800 hover:text-white"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            {editId === null
                                ? "Add User"
                                : "Update User"}
                        </button>

                    </div>

                </form>
            </div>

            {/* ================= SEARCH ================= */}

            <div className="max-w-3xl mx-auto mt-2 mb-8 px-6">

                <input
                    type="text"
                    placeholder="Search Users..."
                    value={
                        search
                    }
                    onChange={(e) => {
                        setSearch(
                            e.target.value
                        );

                        setCurrentPage(
                            1
                        );
                    }}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                />

                <span className="text-sm text-slate-500 mt-2 block">
                    {
                        filteredUsers.length
                    }{" "}
                    Users found
                </span>

            </div>

            {/* ================= TABLE ================= */}

            <div className="max-w-6xl mx-auto mt-8 mb-20 px-6">

                <h2 className="mb-6 font-serif text-3xl text-slate-800 text-center">
                    Users Data
                </h2>

                {/* SORT */}

                <div className="mb-6 flex flex-wrap items-center justify-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            handleSort(
                                "username"
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                    >
                        Sort by Username{" "}
                        {sortField ===
                            "username" &&
                            (sortOrder ===
                            "asc"
                                ? "↑"
                                : "↓")}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleSort(
                                "firstName"
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                    >
                        Sort by Name{" "}
                        {sortField ===
                            "firstName" &&
                            (sortOrder ===
                            "asc"
                                ? "↑"
                                : "↓")}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleSort(
                                "id"
                            )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                    >
                        Sort by ID{" "}
                        {sortField ===
                            "id" &&
                            (sortOrder ===
                            "asc"
                                ? "↑"
                                : "↓")}
                    </button>

                </div>

                {/* TABLE */}

                {paginatedUsers.length ===
                0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
                        No users found
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm text-slate-800 border-collapse">

                                <thead>

                                    <tr className="bg-slate-800">

                                        <th className="w-[10%] px-4 py-3 text-left text-xs text-white">
                                            ID
                                        </th>

                                        <th className="w-[20%] px-4 py-3 text-left text-xs text-white">
                                            User
                                        </th>

                                        <th className="w-[10%] px-4 py-3 text-left text-xs text-white">
                                            Email
                                        </th>

                                        <th className="w-[7%] w px-4 py-3 text-left text-xs text-white">
                                            Gender
                                        </th>

                                        <th className="w-[15%] px-4 py-3 text-left text-xs text-white">
                                            Hobbies
                                        </th>

                                        <th className="w-[30%] px-4 py-3 text-left text-xs text-white">
                                            Address
                                        </th>

                                        <th className="w-[8%] px-4 py-3 text-right text-xs text-white">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {paginatedUsers.map(
                                        (
                                            u,
                                            idx
                                        ) => (
                                            <tr key={u.id} className={`border-t border-slate-100 ${idx % 2 ===1 ? "bg-slate-50" : "bg-white"}`}>

                                                <td className="px-4 py-3 text-slate-500">
                                                    {
                                                        u.id
                                                    }
                                                </td>

                                                <td className="px-4 py-3">

                                                    <div className="flex items-start gap-3">

                                                        {u.photo ? (
                                                            <img
                                                                src={
                                                                    u.photo
                                                                }
                                                                alt={
                                                                    u.username
                                                                }
                                                                className="size-9 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserCircleIcon className="size-9 text-slate-300" />
                                                        )}

                                                        <div>

                                                            <p className="font-semibold">
                                                                {
                                                                    u.firstName
                                                                }{" "}
                                                                {
                                                                    u.lastName
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                @
                                                                {
                                                                    u.username
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-4 py-3 wrap-break-words">
                                                    {
                                                        u.email
                                                    }
                                                </td>

                                                <td className="px-4 py-3">
                                                    {
                                                        u.gender
                                                    }
                                                </td>

                                                <td className="px-4 py-3 wrap-break-words">
                                                    {u.hobby?.join(
                                                        ", "
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 wrap-break-words">

                                                    {
                                                        u.streetAddress
                                                    }
                                                    ,{" "}
                                                    {
                                                        u.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        u.state
                                                    }
                                                    ,{" "}
                                                    {
                                                        u.country
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        u.pinCode
                                                    }

                                                </td>

                                                <td className="px-4 py-3">

                                                    <div className="flex items-center justify-end gap-1">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    u
                                                                )
                                                            }
                                                            className="rounded-md p-1.5 text-amber-600 hover:bg-amber-100"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="size-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    u.id
                                                                )
                                                            }
                                                            className="rounded-md p-1.5 text-red-600 hover:bg-red-100"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="size-4" />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

                {/* PAGINATION */}

                <div className="flex items-center justify-center gap-2 py-8 flex-wrap">

                    <button
                        type="button"
                        disabled={
                            currentPage ===
                            1
                        }
                        onClick={() =>
                            setCurrentPage(
                                (p) =>
                                    p - 1
                            )
                        }
                        className="rounded-lg border border-slate-800 px-4 py-2 text-sm disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {Array.from(
                        {
                            length:
                                totalPages,
                        },
                        (
                            _,
                            index
                        ) =>
                            index + 1
                    ).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() =>
                                setCurrentPage(
                                    p
                                )
                            }
                            className={`rounded-lg border px-4 py-2 text-sm ${
                                p ===
                                currentPage
                                    ? "bg-amber-600 border-amber-600 text-white"
                                    : "border-slate-300"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={
                            currentPage ===
                                totalPages ||
                            totalPages ===
                                0
                        }
                        onClick={() =>
                            setCurrentPage(
                                (p) =>
                                    p + 1
                            )
                        }
                        className="rounded-lg border border-slate-800 px-4 py-2 text-sm disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>

                <p className="text-sm text-slate-500 text-center">

                    Showing{" "}

                    {sortedUsers.length ===
                    0
                        ? 0
                        : startIndex +
                          1}

                    {" "}to{" "}

                    {Math.min(
                        startIndex +
                            usersPerPage,
                        sortedUsers.length
                    )}

                    {" "}of{" "}

                    {
                        sortedUsers.length
                    }{" "}

                    Users

                </p>

            </div>

        </div>
    );
}