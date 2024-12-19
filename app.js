async function submitForm(event) {
    event.preventDefault(); // 기본 동작 막기
    const formData = gatherFormData();

    try {
        const response = await fetch('http://localhost:3000/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log('Server response:', result);
        alert('Data submitted successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
    }
}
