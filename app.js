async function submitForm(event) {
    event.preventDefault(); // 기본 동작 막기
    const formData = gatherFormData();

    try {
        // 로컬 환경에서 http://localhost:3000 을 사용할 수도 있지만
        // 배포 환경에선 상대 경로로 요청하는 것이 안전.
        // 서버와 동일 도메인에서 /api/submit로 접근
        const response = await fetch('/api/submit', {
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
