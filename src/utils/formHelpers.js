// Form state management helpers
export const resetForm = (setForm, initialForm, setShowForm = null, setEditId = null) => {
  setForm(initialForm);
  if (setShowForm) setShowForm(false);
  if (setEditId) setEditId(null);
};

// Date handling
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const getTodayFormatted = () => {
  return formatDate(new Date());
};

// Error handling
export const handleError = (error, setError = null) => {
  const errorMessage = error?.message || "An unknown error occurred";
  
  if (setError) {
    setError(errorMessage);
  } else {
    console.error(errorMessage);
  }
  
  return errorMessage;
};

// Student selection
export const handleStudentSelect = (e, studentsList, setForm) => {
  const studentId = e.target.value;
  const selectedStudent = studentsList.find(student => student.id === studentId);
  setForm(f => ({
    ...f,
    targetStudent: studentId,
    targetStudentName: selectedStudent ? selectedStudent.name : "",
  }));
};