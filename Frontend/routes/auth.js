let router = require('express').Router();
const jwt = require('jsonwebtoken');
const { formatDateString } = require('../utils/format');

// // 회원탈퇴
// router.post('/delete', async function (req, res) {
//     if (!req.session.user) {
//         return res.render('auth/login.ejs', { csrfToken: req.csrfToken() });
//     }

//     try {
//         const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/delete`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userid: req.session.user.userid })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             req.session.destroy();
//             res.clearCookie('uid', { path: '/' });
//             return res.render('index.ejs', { data });
//         } else {
//             // 회원탈퇴 실패
//             return res.redirect('/auth/me');
//         }
//     } catch (err) {
//         console.error(err);
//     }
// });

// 마이페이지
router.get('/me', async function (req, res) {
    if (!req.session.user) {
        return res.render('auth/login.ejs', { csrfToken: req.csrfToken(), user: req.session.user });
    }

    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/edit-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sessionuser': req.session.user.userid
            },
            body: JSON.stringify({ userid: req.session.user.userid })
        });

        const { data } = await response.json();
        const csrfToken = req.csrfToken();

        if (req.session.user.alertMsg) {
            data.alertMsg = req.session.user.alertMsg;
            req.session.user.alertMsg = undefined;
        }

        if (response.ok) {
            data.birthday = formatDateString(data.birthday);
            return res.render('auth/me.ejs', { data, csrfToken, user: req.session.user })
        } else {
            return res.send('잘못된 페이지');
        }
    } catch (err) {
        console.error(err);
    }
});

// 회원정보 수정
router.post('/edit', async function (req, res) {
    if (!req.session.user) {
        return res.render('auth/login.ejs', { csrfToken: req.csrfToken() });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        req.session.user.alertMsg = '이메일 형식이 올바르지 않습니다.';
        return res.redirect('/auth/edit');
    }

    if (req.body.userpw) {
        if (req.body.userpw.length < 8) {
            req.session.user.alertMsg = '비밀번호는 8자리 이상으로 입력해 주세요.';
            return res.redirect('/auth/edit');
        }

        if (req.body.userpw != req.body.userpwre) {
            req.session.user.alertMsg = '다시 입력해 주세요.';
            return res.redirect('/auth/edit');
        }
    }

    if (!req.body.nickname) {
        req.session.user.alertMsg = '닉네임은 한 글자 이상으로 입력해 주세요.';
        return res.redirect('/auth/edit');
    }

    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const { data } = await response.json();
        const csrfToken = req.csrfToken();
        data.birthday = formatDateString(data.birthday);

        req.session.user.nickname = data.nickname;
        return res.render('auth/edit.ejs', { data, csrfToken, user: req.session.user });
    } catch (err) {
        console.error(err);
    }
});

// 회원정보 수정 페이지
router.get('/edit', async function (req, res) {
    if (!req.session.user) {
        return res.render('auth/login.ejs', { csrfToken: req.csrfToken() });
    }

    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/edit-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userid: req.session.user.userid })
        });

        const { data } = await response.json();
        const csrfToken = req.csrfToken();

        if (req.session.user.alertMsg) {
            data.alertMsg = req.session.user.alertMsg;
            req.session.user.alertMsg = undefined;
        }

        if (response.ok) {
            data.birthday = formatDateString(data.birthday);
            return res.render('auth/edit.ejs', { data, csrfToken, user: req.session.user })
        } else {
            return res.send('잘못된 페이지');
        }
    } catch (err) {
        console.error(err);
    }
});


// 로그인 폼
router.get('/login', function (req, res) {
    const client_id = process.env.CLIENT_ID;
    const redirectURI = process.env.REDIRECT_URI;
    const state = 'RANDOM_STATE'; // CSRF 공격 방지를 위한 상태 토큰

    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;

    if (!req.session.user) {
        return res.render('auth/login.ejs', { csrfToken: req.csrfToken(), api_url: api_url });
    }
    res.redirect('/');
});

// 로그인
router.post('/login', async function (req, res) {
    const client_id = process.env.CLIENT_ID;
    const redirectURI = process.env.REDIRECT_URI;
    const state = 'RANDOM_STATE'; // CSRF 공격 방지를 위한 상태 토큰

    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;

    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        const csrfToken = req.csrfToken();
        if (response.ok) {
            const { userid } = req.body;
            const token = jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.session.user = { userid, token, nickname: data.nickname };
            res.cookie('uid', userid);

            return res.redirect('/'); // 로그인 성공
        } else {
            return res.render('auth/login.ejs', { data, csrfToken, api_url: api_url });  // 로그인 실패
        }
    } catch (err) {
        console.error(err);
    }
});


// 로그아웃
router.get('/logout', function (req, res) {
    // 캐시된 거래 내역 삭제
    if (req.session.user && req.session.user.userid) {
        req.transactionCache.del(req.session.user.userid);
    }

    req.session.destroy();
    res.clearCookie('uid', { path: '/' });
    res.redirect('/');
});

// 회원가입 폼
router.get('/sign-up', function (req, res) {
    const csrfToken = req.csrfToken();
    res.render('auth/sign-up.ejs', { csrfToken });
});

// 회원가입 폼에서 중복 아이디 검사
router.post('/check-id', async function (req, res) {
    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/check-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.json(data);
    } catch (err) {
        console.error(err);
    }
});

// 회원가입 폼에서 중복 이메일 검사
router.post('/check-email', async function (req, res) {
    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.json(data);
    } catch (err) {
        console.error(err);
    }
});

// 회원가입 - 유저 등록
router.post('/sign-up', async function (req, res) {
    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        const csrfToken = req.csrfToken();
        if (response.ok) {
            req.session.user = { userid: req.body.userid, nickname: '고객' };
            res.cookie('uid', req.body.userid);
            return res.redirect('/');  // 회원가입 완료
        } else {
            return res.render('auth/sign-up.ejs', { data, csrfToken });  // 회원가입 실패
        }
    } catch (err) {
        console.error(err);
    }
});

router.get('/admin', async function (req, res) {
    let page = req.query.page || 1;
    let itemsPerPage = req.query.itemsPerPage || 10;

    if (!req.session.user) {
        return res.render('auth/login.ejs', { csrfToken: req.csrfToken() });
    }

    const sessionUserId = req.session.user.userid;

    // 관리자 권한 확인: userid가 "admin"인지 확인
    if (sessionUserId !== 'admin') {
        return res.render('auth/error.ejs', { message: '접근 권한이 없습니다.', redirect: '/auth/login' });
    }

    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/admin?page=${page}&itemsPerPage=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'sessionuser': req.session.user ? req.session.user.userid : null // 로그인 확인
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const csrfToken = req.csrfToken();
        return res.render('auth/admin.ejs', {
            data: data.users,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            user: req.session.user,
            csrfToken,
            appkey: process.env.JAVASCRIPT_APPKEY,
        });

    } catch (error) {
        console.error('Fetch error:', error);

        if (error.message.includes('Unexpected token')) {
            return res.status(500).send('Received HTML instead of JSON. Please check the server.');
        }

        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete
router.post('/delete', async function (req, res) {
    try {
        const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ alertMsg: '서버 오류' });
    }
})

module.exports = router;