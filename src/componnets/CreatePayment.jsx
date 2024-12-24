import React, { useState } from 'react'


const CreatePayment = () => {
    const [formData, setFormData] = useState({
        user: "",
        amount: "",
        receitNumber: "",
        paymentMethod: "",
        paymentDate: "",
        paymentStatus: "",
        checked: "",
        comment: "",
    })

    const paymentMethods = [
        {value: 'cash', label: "Cash"},
        {value: 'card', label: "Card"},
        {value: 'mpesa', label: "M-pesa"},
    ]

    const paymentStatuses = [
        {value: 'paid', label: "Paid"},
        {value: 'unpaid', label: "Unpaid"},
        {value: 'cancelled', label: "Cancelled"},
    ]

    const checkedStatuses = [
        {value: 'yes', label: "Yes"},
        {value: 'no', label: "No"},
    ]

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () =>{
        const newErrors = {};

        if (!formData.user.trim()){
            newErrors.user = "User is required"
        } 
        if (!formData.amount.trim()){
            newErrors.amount = "Amount is required"
        }
        if (!formData.receitNumber.trim()){
            newErrors.receitNumber = "Receipt number is required"
        }
        if (!formData.paymentMethod){
            newErrors.paymentMethod = "Payment method is required"
        }else if(!["cash", "card", "mpesa"].includes(formData.paymentMethod)){
            newErrors.paymentMethod = "Invalid payment method"
        }

        if (!formData.paymentDate.trim()){
            newErrors.paymentDate = "Payment date is required"
        }
        if (!formData.paymentStatus){
            newErrors.paymentStatus = "Payment status is required"
        }else if(!["paid", "unpaid", "cancelled"].includes(formData.paymentStatus)){
            newErrors.paymentStatus = "Invalid payment status"
        }
        if (!formData.checked){
            newErrors.checked = "Checked status is required"
        }else if(!["yes", "no",].includes(formData.checked)){
            newErrors.checked = "Invalid checked status"
        }
        if (!formData.comment.trim()){
            newErrors.comment = "Comment is required"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData, [name]:value,
        }));
        if(errors[name]){
            setErrors(prev =>({
                ...prev, [name]: ""
            }));
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(validateForm()){
            try {
                // await axios.post("http://localhost:5000/api/payments", formData);
                setSubmitted(true);
                console.log(formData);

                // Reset form
                setFormData({
                    user: "",
                    amount: "",
                    receitNumber: "",
                    paymentMethod: "",
                    paymentDate: "",
                    paymentStatus: "",
                    checked: "",
                    comment: "",
                })
            } catch (error) {
                console.error("Submission Error", error);
                setErrors(prev => ({
                    ...prev,
                    submit: "Failed to submit form. Please try again."
                }))
            }
           
        }else{
            console.log("Form has errors", errors);
    }
    }
                  
        

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
       <div className="max-w-3xl mx-auto">
        <div className="bg-white text-blackColor shadow-md rounded-lg px-8 py-6">
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Create Payment
          </h2>
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              Form submitted successfully!
            </div>
          )}
            {errors.submit && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {errors.submit}
                </div>
            )}
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">User</label>
                    <input type="text" name="user" id="user" value={formData.user} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md" />
                    {errors.user && <p className="text-red-500">{errors.user}</p>}
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md" />
                    {errors.amount && <p className="text-red-500">{errors.amount}</p>}
                </div>
                <div>
                    <label htmlFor="receitNumber" className="block text-sm font-medium text-gray-700">Receipt Number</label>
                    <input type="text" name="receitNumber" id="receitNumber" value={formData.receitNumber} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md" />
                    {errors.receitNumber && <p className="text-red-500">{errors.receitNumber}</p>}
                </div>
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select name="paymentMethod" id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md">
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                        ))}
                    </select>
                    {errors.paymentMethod && <p className="text-red-500">{errors.paymentMethod}</p>}
                </div>
                <div>
                    <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input type="date" name="paymentDate" id="paymentDate" value={formData.paymentDate} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md" />
                    {errors.paymentDate && <p className="text-red-500">{errors.paymentDate}</p>}
                </div>
                <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <select name="paymentStatus" id="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md">
                        <option value="">Select Payment Status</option>
                        {paymentStatuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                    {errors.paymentStatus && <p className="text-red-500">{errors.paymentStatus}</p>}
                </div>
                <div>
                    <label htmlFor="checked" className="block text-sm font-medium text-gray-700">Checked</label>
                    <select name="checked" id="checked" value={formData.checked} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md">
                        <option value="">Select Checked Status</option>
                        {checkedStatuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                    {errors.checked && <p className="text-red-500">{errors.checked}</p>}
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea name="comment" id="comment" value={formData.comment} onChange={handleChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md" />
                    {errors.comment && <p className="text-red-500">{errors.comment}</p>}
                </div>
                <div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create Payment</button>
                </div>

            </form>
            
        </div>
       </div>
    </div>
  )

}
export default CreatePayment