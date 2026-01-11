import api from "./api";

const API_ADVICE_BASE = "api/advices"; 

const mapAdviceResponse = (advice) => {
    const fullName = (advice.name && advice.surname && advice.name !== 'Anonimni') 
                     ? `${advice.name} ${advice.surname}` 
                     : 'Anonimni Korisnik';
    
    const initials = (advice.name ? advice.name.charAt(0) : 'A') + (advice.surname ? advice.surname.charAt(0) : 'K');

    return {
        id: advice.id,
        name: advice.name || 'Anonimni', 
        surname: advice.surname || 'Korisnik',
        fullName: fullName,
        initials: initials.toUpperCase(),
        
        username: advice.username || 'student',
        content: advice.content,
        dateTime: advice.dateTime,
        isMine: advice.isMine || false,
        isLiked: advice.isLiked || false,
        likedByMe: advice.likedByMe,
        myAdvice: advice.myAdvice,
        likesCount: advice.likesCount || 0,
        isReported: advice.reported || false,
        commentsCount: advice.commentsCount || 0, 
    };
};

const mapCommentResponse = (comment) => {
    const fullName = (comment.name && comment.surname && comment.name !== 'Anonimni') 
                     ? `${comment.name} ${comment.surname}` 
                     : 'Anonimni Korisnik';
    const initials = (comment.name ? comment.name.charAt(0) : 'A') + (comment.surname ? comment.surname.charAt(0) : 'K');

    return {
        id: comment.id,
        content: comment.content,
        dateTime: comment.dateTime,
        name: comment.name || 'Anonimni', 
        surname: comment.surname || 'Korisnik',
        fullName: fullName, 
        initials: initials.toUpperCase(), 
        
        // ⭐ DODAJEMO USERNAME SA BACKENDA!
        username: comment.username || 'student', // Koristimo fallback 'student' samo za sigurnost
        
        isMine: comment.isMine || false, 
        isReported: comment.reported || false,
    };
};


export const getSubjectsWithId = async (year) => {
    try {
        const res = await api.get(`${API_ADVICE_BASE}/subjects-with-id`, { params: { year } }); 
        return res.data; 
    } catch (err) {
        throw err.response?.data?.error || "Greška pri učitavanju predmeta sa ID-em";
    }
};

export const getAdvicesBySubjectId = async (subjectId) => {
    try {
        const res = await api.get(`${API_ADVICE_BASE}/by-id`, { 
            params: { id: subjectId } 
        }); 
        
        return res.data.map(mapAdviceResponse);
    } catch (err) {
        throw err.response?.data?.error || "Greška pri učitavanju savjeta";
    }
};

export const createAdvice = async (subjectId, content) => {
    try {
        const payload = { subjectId, content }; 
        const res = await api.post(`${API_ADVICE_BASE}/by-id`, payload); 

        return mapAdviceResponse(res.data); 
    } catch (err) {
        throw err.response?.data?.error || "Greška pri objavljivanju savjeta";
    }
};

export const deleteAdvice = async (adviceId) => {
    try {
        const res = await api.delete(`${API_ADVICE_BASE}/${adviceId}/delete`); 
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const toggleLike = async (adviceId) => {
    try {
        const res = await api.put(`${API_ADVICE_BASE}/${adviceId}/like`); 
        return { 
            isLiked: res.data.likedByMe || false, 
            likesCount: res.data.totalLikes || 0 
        }; 
    } catch (err) {
        throw err.response?.data?.error || "Greška pri lajkovanju/odlajkovanju";
    }
};

export const reportAdvice = async (adviceId) => {
    try {
        const res = await api.post(`${API_ADVICE_BASE}/${adviceId}/report`);
        return true; 
    } catch (err) {
        throw err;
    }
};

export const getCommentsByAdviceId = async (adviceId) => {
    try {
        const res = await api.get(`${API_ADVICE_BASE}/${adviceId}/comments`); 
        return res.data.map(mapCommentResponse);
    } catch (err) {
        throw err.response?.data?.error || "Greška pri učitavanju komentara";
    }
};

export const postComment = async (adviceId, content, parentCommentId = null) => {
    try {
        const payload = { adviceId, content, parentCommentId };
        const res = await api.post(`${API_ADVICE_BASE}/comments`, payload);

        return mapCommentResponse(res.data);
    } catch (err) {
        throw err.response?.data?.error || "Greška pri slanju komentara";
    }
};

export const reportComment = async (commentId) => {
    try {
        const res = await api.post(`${API_ADVICE_BASE}/comments/${commentId}/report`);
        return true; 
    } catch (err) {
        throw err.response?.data?.error || "Greška pri prijavljivanju komentara";
    }
};

export default {
    getSubjectsWithId,
    getAdvicesBySubjectId,
    createAdvice,
    toggleLike,
    reportAdvice,
    getCommentsByAdviceId,
    postComment,
    reportComment,
    deleteAdvice
};