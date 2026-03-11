# คู่มือการจัดการฟอร์มและการแจ้งเตือน (React Hook Form + Zod + Sonner)

คู่มือนี้สรุปขั้นตอนที่ได้ดำเนินการเพื่อปรับปรุงระบบการจัดการฟอร์มและแจ้งเตือนในโปรเจกต์ Point Web โดยใช้แนวทาง **Controlled Components (Method 2)**

## 1. การติดตั้ง Library

```bash
npm install react-hook-form zod @hookform/resolvers sonner
```

---

## 2. โครงสร้างคอมโพเนนต์ (The Pattern)

เราแยกความรับผิดชอบออกเป็น 3 ส่วน เพื่อให้โค้ดสะอาดและดูแลรักษาง่าย:

1.  **Base UI Components**: (`Input.tsx`, `Select.tsx`) รับเฉพาะ props พื้นฐาน มุ่งเน้นไปที่การจัดสไตล์
2.  **Controlled Logic Components**: (`FormInput.tsx`, `FormSelect.tsx`) ใช้ `useController` จาก `react-hook-form` เพื่อเชื่อมต่อ UI เข้ากับ Form Logic
3.  **Page Level**: (`RegisterPage.tsx`) จัดการ Schema และ Submit Logic โดยส่ง `control` ไปให้คอมโพเนนต์ลูก

---

## 3. การสร้าง Controlled Logic Components

เราสร้างคอมโพเนนต์ที่ "รู้ความลับ" ของ Hook Form โดยใช้ `useController`

**ไฟล์:** `src/components/FormInput.tsx`
```tsx
import { useController, Control, FieldValues, Path } from 'react-hook-form';

export function FormInput<T extends FieldValues>({ name, control, label, ...props }) {
  const { field, fieldState: { error } } = useController({ name, control });
  return <Input {...field} {...props} label={label} error={error?.message} />;
}
```

---

## 4. การจัดการที่ Root Layout

ใส่ `<Toaster />` ไว้ที่ `src/app/layout.tsx` เพียงครั้งเดียว

```tsx
import { Toaster } from "sonner";

// ... ใน body
{children}
<Toaster richColors position="top-right" />
```

---

## 5. การใช้ในหน้า Page (Register)

### ขั้นตอนที่ 1: กำหนด Schema ด้วย Zod
```tsx
const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    // ...
});
```

### ขั้นตอนที่ 2: ตั้งค่า useForm และดึง `control`
```tsx
const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { ... }
});
```

### ขั้นตอนที่ 3: การวาง UI ในฟอร์ม
โค้ดจะสะอาดมากเพราะไม่ต้องส่ง `register` หรือ `error` เอง

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
    <FormInput name="username" control={control} label="Username" />
    <FormSelect name="gender" control={control} label="Gender" options={...} />
    <Button type="submit">Submit</Button>
</form>
```

---

## ข้อดีของแนวทางนี้ (Method 2)
1.  **Declarative**: หน้า Page บอกแค่ว่ามีฟิลด์อะไรบ้าง ไม่ต้องยุ่งกับ Logic การเข้าถึง Error
2.  **Reusable**: สามารถนำ `FormInput` ไปใช้ในหน้าอื่นๆ ได้ทันทีเพียงแค่ส่ง `control` ไป
3.  **Scalable**: หากต้องการเปลี่ยน UI Library ในอนาคต เราแก้แค่ที่เดียวคือใน `FormInput`
4.  **No more forwardRef**: ไม่จำเป็นต้องใช้ `forwardRef` ในคอมโพเนนต์พื้นฐาน (หากไม่ได้ต้องการเข้าถึง DOM โดยตรง)
