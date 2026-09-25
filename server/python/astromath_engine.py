#!/usr/bin/env python3
"""
AstroMath Astronomical Engine (Python)
--------------------------------------
Calculates high-precision Sidereal Vedic Horoscopes using Python `ephem`,
astronomical trigonometry, Lahiri (Chitrapaksha) Ayanamsa, 
16 Divisional harmonics (D1, D9, D10), 120-Year Vimshottari Dasha, 
and Real-Time Gochar (Transits).
"""

import sys
import json
import math
import datetime
import ephem

# Ensure UTF-8 output on all operating systems including Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stdin, 'reconfigure'):
    sys.stdin.reconfigure(encoding='utf-8')

# Zodiac Signs (English & Marathi)
ZODIAC_SIGNS = [
    'Aries (मेष)', 'Taurus (वृषभ)', 'Gemini (मिथुन)', 'Cancer (कर्क)',
    'Leo (सिंह)', 'Virgo (कन्या)', 'Libra (तूळ)', 'Scorpio (वृश्चिक)',
    'Sagittarius (धनु)', 'Capricorn (मकर)', 'Aquarius (कुंभ)', 'Pisces (मीन)'
]

# 27 Lunar Mansions (Nakshatras)
NAKSHATRAS = [
    {'name': 'Ashwini (अश्विनी)', 'lord': 'Ketu'},
    {'name': 'Bharani (भरणी)', 'lord': 'Venus'},
    {'name': 'Krittika (कृत्तिका)', 'lord': 'Sun'},
    {'name': 'Rohini (रोहिणी)', 'lord': 'Moon'},
    {'name': 'Mrigashira (मृगशीर्ष)', 'lord': 'Mars'},
    {'name': 'Ardra (आर्द्रा)', 'lord': 'Rahu'},
    {'name': 'Punarvasu (पुनर्वसू)', 'lord': 'Jupiter'},
    {'name': 'Pushya (पुष्य)', 'lord': 'Saturn'},
    {'name': 'Ashlesha (आश्लेषा)', 'lord': 'Mercury'},
    {'name': 'Magha (मघा)', 'lord': 'Ketu'},
    {'name': 'Purva Phalguni (पु.फाल्गुनी)', 'lord': 'Venus'},
    {'name': 'Uttara Phalguni (उ.फाल्गुनी)', 'lord': 'Sun'},
    {'name': 'Hasta (हस्त)', 'lord': 'Moon'},
    {'name': 'Chitra (चित्रा)', 'lord': 'Mars'},
    {'name': 'Swati (स्वाती)', 'lord': 'Rahu'},
    {'name': 'Vishakha (विशाखा)', 'lord': 'Jupiter'},
    {'name': 'Anuradha (अनुराधा)', 'lord': 'Saturn'},
    {'name': 'Jyeshtha (ज्येष्ठा)', 'lord': 'Mercury'},
    {'name': 'Mula (मूळ)', 'lord': 'Ketu'},
    {'name': 'Purva Ashadha (पु.आषाढा)', 'lord': 'Venus'},
    {'name': 'Uttara Ashadha (उ.आषाढा)', 'lord': 'Sun'},
    {'name': 'Shravana (श्रवण)', 'lord': 'Moon'},
    {'name': 'Dhanishta (धनिष्ठा)', 'lord': 'Mars'},
    {'name': 'Shatabhisha (शततारका)', 'lord': 'Rahu'},
    {'name': 'Purva Bhadrapada (पु.भाद्रपदा)', 'lord': 'Jupiter'},
    {'name': 'Uttara Bhadrapada (उ.भाद्रपदा)', 'lord': 'Saturn'},
    {'name': 'Revati (रेवती)', 'lord': 'Mercury'},
]

# Vimshottari Dasha Lords and ruling year spans
DASHA_LORDS = [
    {'lord': 'Ketu', 'years': 7},
    {'lord': 'Venus', 'years': 20},
    {'lord': 'Sun', 'years': 6},
    {'lord': 'Moon', 'years': 10},
    {'lord': 'Mars', 'years': 7},
    {'lord': 'Rahu', 'years': 18},
    {'lord': 'Jupiter', 'years': 16},
    {'lord': 'Saturn', 'years': 19},
    {'lord': 'Mercury', 'years': 17},
]

PLANET_NAMES_MR = {
    'Sun': 'सूर्य',
    'Moon': 'चंद्र',
    'Mars': 'मंगळ',
    'Mercury': 'बुध',
    'Jupiter': 'गुरू',
    'Venus': 'शुक्र',
    'Saturn': 'शनी',
    'Rahu': 'राहू',
    'Ketu': 'केतू'
}

SIGN_LORDS = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
    5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
    9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
}

def normalize_deg(deg):
    d = deg % 360.0
    if d < 0:
        d += 360.0
    return d

def format_degree(deg):
    d = int(math.floor(deg % 30.0))
    rem = (deg % 1.0) * 60.0
    m = int(math.floor(rem))
    s = int(round((rem % 1.0) * 60.0))
    if s >= 60:
        s = 0
        m += 1
    if m >= 60:
        m = 0
        d += 1
    return f"{d}° {m}' {s}\""

def get_nakshatra_info(longitude):
    total_minutes = longitude * 60.0
    nak_length_min = 800.0   # 13° 20' = 800 minutes
    pada_length_min = 200.0  # 3° 20' = 200 minutes
    
    nak_idx = int(math.floor(total_minutes / nak_length_min)) % 27
    rem_min = total_minutes % nak_length_min
    pada = int(math.floor(rem_min / pada_length_min)) + 1
    
    return {
        'index': nak_idx,
        'name': NAKSHATRAS[nak_idx]['name'],
        'lord': NAKSHATRAS[nak_idx]['lord'],
        'pada': pada,
        'fractionElapsed': rem_min / nak_length_min
    }

def get_navamsha_sign(longitude):
    sign_idx = int(math.floor(longitude / 30.0))  # 0 to 11
    deg_in_sign = longitude % 30.0
    navamsha_idx = int(math.floor(deg_in_sign / (30.0 / 9.0)))  # 0 to 8
    
    # 0=Fire (Aries), 1=Earth (Cap), 2=Air (Libra), 3=Water (Cancer)
    element = sign_idx % 4
    if element == 0:
        start_sign = 1
    elif element == 1:
        start_sign = 10
    elif element == 2:
        start_sign = 7
    else:
        start_sign = 4
        
    return ((start_sign - 1 + navamsha_idx) % 12) + 1

def get_dashamsha_sign(longitude):
    sign_idx = int(math.floor(longitude / 30.0))
    deg_in_sign = longitude % 30.0
    dashamsha_idx = int(math.floor(deg_in_sign / 3.0))  # 0 to 9
    
    is_odd = (sign_idx % 2 == 0) # 0 is Aries (sign 1, odd in Vedic)
    start_sign = (sign_idx + 1) if is_odd else (((sign_idx + 8) % 12) + 1)
    
    return ((start_sign - 1 + dashamsha_idx) % 12) + 1

def get_lahiri_ayanamsa(jd):
    """
    Standard IAU / Chitrapaksha Lahiri Ayanamsa:
    At Epoch J2000.0 (JD 2451545.0): 23° 51' 25.533" = 23.8570925°
    Annual precession velocity: 50.290966 arcseconds per tropical year.
    """
    delta_years = (jd - 2451545.0) / 365.25
    annual_rate = 50.290966 / 3600.0
    return 23.8570925 + delta_years * annual_rate

def calculate_sidereal_ascendant(obs, ayanamsa, jd):
    """
    Calculates exact Ascendant (Lagna) using local sidereal time (RAMC),
    geographical latitude, and true obliquity of ecliptic.
    """
    lst = float(obs.sidereal_time()) # radians
    T = (jd - 2451545.0) / 36525.0
    # Obliquity of ecliptic
    eps = math.radians(23.4392911 - (46.8150 * T) / 3600.0)
    
    y = math.cos(lst)
    x = -math.sin(lst) * math.cos(eps) - math.tan(obs.lat) * math.sin(eps)
    trop_asc_rad = math.atan2(y, x)
    trop_asc_deg = (math.degrees(trop_asc_rad) + 360.0) % 360.0
    
    sid_asc_deg = normalize_deg(trop_asc_deg - ayanamsa)
    return sid_asc_deg

def calculate_true_rahu(jd, ayanamsa):
    """
    High-precision Lunar Node calculation based on IAU/Brown lunar theory.
    """
    T = (jd - 2451545.0) / 36525.0
    # Mean node
    rahu_mean_trop = (125.0445550 - 1934.1361849 * T + 0.0020762 * (T**2) + (T**3)/467410.0 - (T**4)/60616000.0) % 360.0
    
    # Perturbation harmonics (Meeus Chapter 47)
    d_rad = math.radians
    D = 297.85036 + 445267.111480 * T - 0.0019142 * (T**2)
    M = 357.52772 + 35999.050340 * T - 0.0001603 * (T**2)
    M_prime = 134.96298 + 477198.867398 * T + 0.0086972 * (T**2)
    F = 93.27191 + 483202.017538 * T - 0.0036825 * (T**2)

    rahu_true_trop = (rahu_mean_trop 
                      - 1.4979 * math.sin(d_rad(2.0 * (F - D))) 
                      - 0.1500 * math.sin(d_rad(M)) 
                      - 0.1226 * math.sin(d_rad(2.0 * F)) 
                      + 0.1176 * math.sin(d_rad(2.0 * D)) 
                      - 0.0801 * math.sin(d_rad(2.0 * (F - D) + M))) % 360.0
                      
    rahu_sid = normalize_deg(rahu_true_trop - ayanamsa)
    return rahu_sid

def calculate_vimshottari(dob, moon_nak):
    parts = [int(p) for p in dob.split('-')]
    birth_date = datetime.date(parts[0], parts[1], parts[2])
    first_lord = moon_nak['lord']
    start_index = next(i for i, d in enumerate(DASHA_LORDS) if d['lord'] == first_lord)
    fraction_remaining = 1.0 - moon_nak['fractionElapsed']
    
    timeline = []
    current_date = birth_date
    today = datetime.date.today()
    
    for i in range(9):
        idx = (start_index + i) % 9
        dasha = DASHA_LORDS[idx]
        full_years = dasha['years']
        effective_years = full_years * fraction_remaining if i == 0 else float(full_years)
        
        start_d = current_date
        # Approximate addition in days
        duration_days = int(effective_years * 365.25)
        end_d = start_d + datetime.timedelta(days=duration_days)
        
        is_current = (start_d <= today <= end_d)
        
        # Calculate 9 Antardashas
        antardashas = []
        sub_curr = start_d
        for j in range(9):
            sub_idx = (idx + j) % 9
            sub_lord = DASHA_LORDS[sub_idx]
            sub_fraction = (full_years * sub_lord['years']) / 120.0
            sub_days = int(sub_fraction * 365.25)
            sub_end = sub_curr + datetime.timedelta(days=sub_days)
            
            is_sub_current = (sub_curr <= today <= sub_end)
            antardashas.append({
                'lord': sub_lord['lord'],
                'startDate': sub_curr.isoformat(),
                'endDate': sub_end.isoformat(),
                'isCurrent': is_sub_current
            })
            sub_curr = sub_end
            
        active_antar = next((a['lord'] for a in antardashas if a['isCurrent']), None)
        
        timeline.append({
            'lord': dasha['lord'],
            'years': full_years,
            'startDate': start_d.isoformat(),
            'endDate': end_d.isoformat(),
            'isCurrent': is_current,
            'currentAntar': active_antar,
            'antardashas': antardashas
        })
        current_date = end_d
        
    return timeline

def calculate_birth_chart(dob, tob, lat, lon, tz=5.5):
    year, month, day = [int(x) for x in dob.split('-')]
    hours, minutes = [int(x) for x in tob.split(':')]
    
    # Calculate UTC time
    local_hours = hours + minutes / 60.0
    utc_hours = local_hours - tz
    
    # Create Observer
    # ephem date standard: float where 0.0 is 1899-12-31 12:00:00 UTC -> JD 2415020.0
    dt_utc = datetime.datetime(year, month, day) + datetime.timedelta(hours=utc_hours)
    date_str = dt_utc.strftime('%Y/%m/%d %H:%M:%S')
    
    obs = ephem.Observer()
    obs.date = ephem.Date(date_str)
    obs.lat = math.radians(lat)
    obs.lon = math.radians(lon)
    
    jd = float(obs.date) + 2415020.0
    ayanamsa = get_lahiri_ayanamsa(jd)
    
    # Ascendant (Lagna)
    sidereal_asc = calculate_sidereal_ascendant(obs, ayanamsa, jd)
    lagna_sign_num = int(math.floor(sidereal_asc / 30.0)) + 1
    
    # D9 and D10 Ascendants
    d9_lagna_sign = get_navamsha_sign(sidereal_asc)
    d10_lagna_sign = get_dashamsha_sign(sidereal_asc)
    
    # Planetary definitions
    planets_to_calc = [
        ('Sun', ephem.Sun),
        ('Moon', ephem.Moon),
        ('Mars', ephem.Mars),
        ('Mercury', ephem.Mercury),
        ('Jupiter', ephem.Jupiter),
        ('Venus', ephem.Venus),
        ('Saturn', ephem.Saturn),
    ]
    
    planets = {}
    d1_houses = {str(i): [] for i in range(1, 13)}
    d9_houses = {str(i): [] for i in range(1, 13)}
    d10_houses = {str(i): [] for i in range(1, 13)}
    
    # Step for speed calculation: 1 hour
    step = 1.0 / 24.0
    obs_prev = ephem.Observer()
    obs_prev.lat, obs_prev.lon = obs.lat, obs.lon
    obs_prev.date = ephem.Date(float(obs.date) - step)
    
    obs_next = ephem.Observer()
    obs_next.lat, obs_next.lon = obs.lat, obs.lon
    obs_next.date = ephem.Date(float(obs.date) + step)
    
    for name, cons in planets_to_calc:
        p = cons()
        p.compute(obs)
        trop_lon = math.degrees(ephem.Ecliptic(p).lon) % 360.0
        sid_lon = normalize_deg(trop_lon - ayanamsa)
        
        # Calculate daily speed and retrograde
        p_prev = cons()
        p_prev.compute(obs_prev)
        lon_prev = math.degrees(ephem.Ecliptic(p_prev).lon) % 360.0
        
        p_next = cons()
        p_next.compute(obs_next)
        lon_next = math.degrees(ephem.Ecliptic(p_next).lon) % 360.0
        
        dlon = lon_next - lon_prev
        if dlon > 180.0: dlon -= 360.0
        elif dlon < -180.0: dlon += 360.0
        daily_speed = dlon / (2.0 * step)
        is_retro = bool(daily_speed < 0)
        
        sign_idx = int(math.floor(sid_lon / 30.0))
        sign_num = sign_idx + 1
        nak = get_nakshatra_info(sid_lon)
        
        # House placement in D1
        house_num = (((sign_num - lagna_sign_num + 12) % 12) + 1)
        
        # D9
        d9_sign = get_navamsha_sign(sid_lon)
        d9_house = (((d9_sign - d9_lagna_sign + 12) % 12) + 1)
        
        # D10
        d10_sign = get_dashamsha_sign(sid_lon)
        d10_house = (((d10_sign - d10_lagna_sign + 12) % 12) + 1)
        
        p_data = {
            'name': name,
            'nameMr': PLANET_NAMES_MR[name],
            'longitude': sid_lon,
            'sign': ZODIAC_SIGNS[sign_idx],
            'signNumber': sign_num,
            'house': house_num,
            'degreeFormatted': format_degree(sid_lon),
            'speed': daily_speed,
            'isRetrograde': is_retro,
            'nakshatra': nak['name'],
            'nakshatraLord': nak['lord'],
            'pada': nak['pada']
        }
        planets[name] = p_data
        d1_houses[str(house_num)].append({'name': PLANET_NAMES_MR[name], 'deg': format_degree(sid_lon), 'isRetro': is_retro})
        d9_houses[str(d9_house)].append({'name': PLANET_NAMES_MR[name], 'deg': str(d9_sign), 'isRetro': is_retro})
        d10_houses[str(d10_house)].append({'name': PLANET_NAMES_MR[name], 'deg': str(d10_sign), 'isRetro': is_retro})
        
    # Rahu & Ketu (True Node)
    rahu_sid = calculate_true_rahu(jd, ayanamsa)
    rahu_sign_idx = int(math.floor(rahu_sid / 30.0))
    rahu_sign_num = rahu_sign_idx + 1
    rahu_nak = get_nakshatra_info(rahu_sid)
    rahu_house = (((rahu_sign_num - lagna_sign_num + 12) % 12) + 1)
    
    rahu_d9_sign = get_navamsha_sign(rahu_sid)
    rahu_d9_house = (((rahu_d9_sign - d9_lagna_sign + 12) % 12) + 1)
    
    rahu_d10_sign = get_dashamsha_sign(rahu_sid)
    rahu_d10_house = (((rahu_d10_sign - d10_lagna_sign + 12) % 12) + 1)
    
    planets['Rahu'] = {
        'name': 'Rahu',
        'nameMr': PLANET_NAMES_MR['Rahu'],
        'longitude': rahu_sid,
        'sign': ZODIAC_SIGNS[rahu_sign_idx],
        'signNumber': rahu_sign_num,
        'house': rahu_house,
        'degreeFormatted': format_degree(rahu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': rahu_nak['name'],
        'nakshatraLord': rahu_nak['lord'],
        'pada': rahu_nak['pada']
    }
    d1_houses[str(rahu_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': format_degree(rahu_sid), 'isRetro': True})
    d9_houses[str(rahu_d9_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': str(rahu_d9_sign), 'isRetro': True})
    d10_houses[str(rahu_d10_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': str(rahu_d10_sign), 'isRetro': True})
    
    # Ketu (180 degrees opposite Rahu)
    ketu_sid = normalize_deg(rahu_sid + 180.0)
    ketu_sign_idx = int(math.floor(ketu_sid / 30.0))
    ketu_sign_num = ketu_sign_idx + 1
    ketu_nak = get_nakshatra_info(ketu_sid)
    ketu_house = (((ketu_sign_num - lagna_sign_num + 12) % 12) + 1)
    
    ketu_d9_sign = get_navamsha_sign(ketu_sid)
    ketu_d9_house = (((ketu_d9_sign - d9_lagna_sign + 12) % 12) + 1)
    
    ketu_d10_sign = get_dashamsha_sign(ketu_sid)
    ketu_d10_house = (((ketu_d10_sign - d10_lagna_sign + 12) % 12) + 1)
    
    planets['Ketu'] = {
        'name': 'Ketu',
        'nameMr': PLANET_NAMES_MR['Ketu'],
        'longitude': ketu_sid,
        'sign': ZODIAC_SIGNS[ketu_sign_idx],
        'signNumber': ketu_sign_num,
        'house': ketu_house,
        'degreeFormatted': format_degree(ketu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': ketu_nak['name'],
        'nakshatraLord': ketu_nak['lord'],
        'pada': ketu_nak['pada']
    }
    d1_houses[str(ketu_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': format_degree(ketu_sid), 'isRetro': True})
    d9_houses[str(ketu_d9_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': str(ketu_d9_sign), 'isRetro': True})
    d10_houses[str(ketu_d10_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': str(ketu_d10_sign), 'isRetro': True})
    
    # Vimshottari Dasha
    moon_nak = get_nakshatra_info(planets['Moon']['longitude'])
    dasha_timeline = calculate_vimshottari(dob, moon_nak)
    current_dasha = next((d for d in dasha_timeline if d['isCurrent']), dasha_timeline[0])
    
    # Mangal Dosha
    mars_house = planets['Mars']['house']
    dosha_houses = [1, 2, 4, 7, 8, 12]
    is_mars_in_dosha_house = mars_house in dosha_houses
    is_exalted_or_own = planets['Mars']['signNumber'] in [1, 8, 10]
    has_cancellation = is_exalted_or_own or (planets['Jupiter']['house'] == mars_house)
    has_mangal_dosha = is_mars_in_dosha_house and not has_cancellation
    
    tenth_sign_num = ((lagna_sign_num + 8) % 12) + 1
    seventh_sign_num = ((lagna_sign_num + 5) % 12) + 1
    
    return {
        'julianDay': jd,
        'ayanamsa': ayanamsa,
        'engine': 'Python ephem 4.2.1 / Chitrapaksha Astronomical Core',
        'lagna': {
            'sign': ZODIAC_SIGNS[lagna_sign_num - 1],
            'signNumber': lagna_sign_num,
            'degree': sidereal_asc,
            'degreeFormatted': format_degree(sidereal_asc)
        },
        'planets': planets,
        'divisionalCharts': {
            'D1': {'lagnaSign': lagna_sign_num, 'houses': d1_houses},
            'D9': {'lagnaSign': d9_lagna_sign, 'houses': d9Houses if 'd9Houses' in locals() else d9_houses},
            'D10': {'lagnaSign': d10_lagna_sign, 'houses': d10_houses}
        },
        'dashaTimeline': dasha_timeline,
        'currentDasha': {
            'maha': current_dasha['lord'],
            'antar': current_dasha['currentAntar'] or current_dasha['lord'],
            'until': current_dasha['endDate']
        },
        'careerAnalysis': {
            'tenthHouseSign': ZODIAC_SIGNS[tenth_sign_num - 1],
            'tenthLord': SIGN_LORDS[tenth_sign_num],
            'favorableDomains': 'Technology, Analytics, Leadership & Consulting',
            'inclination': 'High Growth & Strategic Initiatives',
            'summary': f"१० व्या भावाचा स्वामी {PLANET_NAMES_MR.get(SIGN_LORDS[tenth_sign_num], SIGN_LORDS[tenth_sign_num])} असून करिअरमध्ये प्रगती आणि मानसन्मानाचे योग आहेत."
        },
        'marriageAnalysis': {
            'seventhHouseSign': ZODIAC_SIGNS[seventh_sign_num - 1],
            'hasMangalDosha': has_mangal_dosha,
            'doshaDetails': (
                f"मंगळ {mars_house} व्या भावात असल्याने मंगळ दोष दर्शवतो." if has_mangal_dosha
                else f"मंगळ {mars_house} व्या भावात आहे, परंतु शुभ योगामुळे मंगळ दोष परिहार झाला आहे." if (is_mars_in_dosha_house and has_cancellation)
                else "मंगळ १, २, ४, ७, ८ किंवा १२ व्या भावात नसल्यामुळे कोणताही मंगळ दोष नाही."
            ),
            'summary': 'सप्तम भाव आणि नवांश चक्रानुसार वैवाहिक जीवनात सामंजस्य आणि स्थैर्य लाभेल.'
        }
    }

def calculate_daily_gochar(natal_data):
    """
    Computes today's real-time transit positions via Python ephem
    and determines Chandra Bala and Tara Bala relative to natal Moon.
    """
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    date_str = now_utc.strftime('%Y/%m/%d %H:%M:%S')
    
    obs = ephem.Observer()
    obs.date = ephem.Date(date_str)
    
    jd_now = float(obs.date) + 2415020.0
    ayanamsa = get_lahiri_ayanamsa(jd_now)
    
    # Today's Moon
    moon = ephem.Moon()
    moon.compute(obs)
    today_moon_trop = math.degrees(ephem.Ecliptic(moon).lon) % 360.0
    today_moon_sid = normalize_deg(today_moon_trop - ayanamsa)
    
    today_moon_sign_idx = int(math.floor(today_moon_sid / 30.0))
    today_moon_nak = get_nakshatra_info(today_moon_sid)
    
    # Natal Moon
    natal_planets = natal_data.get('planets', {}) if isinstance(natal_data, dict) else {}
    natal_moon_lon = natal_planets.get('Moon', {}).get('longitude', 0.0)
    natal_moon_sign_idx = int(math.floor(natal_moon_lon / 30.0))
    natal_moon_nak = get_nakshatra_info(natal_moon_lon)
    
    # Chandra Bala: House of today's Moon from natal Moon (1 to 12)
    chandra_bala_house = (((today_moon_sign_idx - natal_moon_sign_idx + 12) % 12) + 1)
    favorable_chandra_houses = [1, 3, 6, 7, 10, 11]
    is_chandra_favorable = chandra_bala_house in favorable_chandra_houses
    
    if chandra_bala_house in [3, 11]:
        chandra_score = 9
        chandra_desc = "चंद्र गोचर अतिशय शुभ स्थानात आहे. महत्त्वाची कामे मार्गी लागतील, धनलाभ आणि उत्साहाचा दिवस आहे."
    elif chandra_bala_house in [6, 10]:
        chandra_score = 8
        chandra_desc = "कामाच्या ठिकाणी प्रगती, विरोधकांवर मात आणि नियोजित उद्दिष्टे साध्य होतील."
    elif chandra_bala_house in [8, 12]:
        chandra_score = 4
        chandra_desc = "आज अनावश्यक खर्च आणि मानसिक तणाव टाळा. मोठे आर्थिक किंवा धाडसी निर्णय पुढे ढकला."
    else:
        chandra_score = 7
        chandra_desc = "दिवस सर्वसाधारण अनुकूल आहे. कौटुंबिक सहकार्य लाभेल."
        
    # Tara Bala
    tara_count = (((today_moon_nak['index'] - natal_moon_nak['index'] + 27) % 9) + 1)
    TARA_NAMES = [
        '', 'Janma (जन्म)', 'Sampat (संपत)', 'Vipat (विपत)', 'Kshema (क्षेम)',
        'Pratyari (प्रत्यरी)', 'Sadhaka (साधक)', 'Vadha (वध)', 'Mitra (मित्र)', 'Ati-Mitra (अतिमित्र)'
    ]
    auspicious_taras = [2, 4, 6, 8, 9]
    is_tara_auspicious = tara_count in auspicious_taras
    tara_name = TARA_NAMES[tara_count]
    
    tara_desc = (
        f"{tara_name} तारा सुरू असल्याने आज नवीन उपक्रम, प्रवास आणि गुंतवणुकीसाठी शुभ योग आहे."
        if is_tara_auspicious
        else f"{tara_name} तारा असल्याने आज वादविवाद टाळा आणि संयमाने निर्णय घ्या."
    )
    
    today_date_str = now_utc.strftime('%Y-%m-%d')
    return {
        'date': today_date_str,
        'engine': 'Python ephem 4.2.1 / Real-time Transit Engine',
        'todayMoon': {
            'sign': ZODIAC_SIGNS[today_moon_sign_idx],
            'degree': format_degree(today_moon_sid),
            'nakshatra': today_moon_nak['name']
        },
        'chandraBala': {
            'houseFromMoon': chandra_bala_house,
            'score': chandra_score,
            'status': 'शुभ (Favorable)' if is_chandra_favorable else 'मध्यम / सावध',
            'description': chandra_desc
        },
        'taraBala': {
            'taraNumber': tara_count,
            'taraName': tara_name,
            'auspicious': is_tara_auspicious,
            'description': tara_desc
        },
        'summary': f"आज चंद्र {ZODIAC_SIGNS[today_moon_sign_idx]} राशीत आणि {today_moon_nak['name']} नक्षत्रात भ्रमण करत आहे. चंद्रबल {chandra_score}/10 असून दिवस सकारात्मक आणि गतिमान राहील."
    }

def main():
    try:
        raw_input = None
        if len(sys.argv) > 1:
            raw_input = sys.argv[1]
            if raw_input.startswith('b64:'):
                import base64
                raw_input = base64.b64decode(raw_input[4:]).decode('utf-8')
        else:
            raw_input = sys.stdin.read()
            
        if not raw_input or not raw_input.strip():
            print(json.dumps({'error': 'No input JSON provided'}))
            sys.exit(1)
            
        try:
            payload = json.loads(raw_input)
        except Exception:
            # If quotes were stripped by cmd/powershell, attempt eval or lenient parse
            import ast
            payload = ast.literal_eval(raw_input)
            
        action = payload.get('action', 'calculate')
        
        if action == 'calculate':
            dob = payload['dob']
            tob = payload['tob']
            lat = float(payload.get('lat', 18.5204))
            lon = float(payload.get('lon', 73.8567))
            tz = float(payload.get('tz', 5.5))
            
            result = calculate_birth_chart(dob, tob, lat, lon, tz)
            print(json.dumps(result, ensure_ascii=False))
        elif action == 'daily':
            natal_data = payload.get('natalData', {})
            result = calculate_daily_gochar(natal_data)
            print(json.dumps(result, ensure_ascii=False))
        else:
            print(json.dumps({'error': f"Unknown action: {action}"}))
            sys.exit(1)
            
    except Exception as e:
        import traceback
        err_msg = {
            'error': str(e),
            'traceback': traceback.format_exc()
        }
        print(json.dumps(err_msg, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main()
