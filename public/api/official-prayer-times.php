<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

function out_json($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function q($key, $default = '') { return isset($_GET[$key]) ? trim((string)$_GET[$key]) : $default; }
function valid_coord($lat, $lng) { return is_numeric($lat) && is_numeric($lng) && abs((float)$lat) <= 90 && abs((float)$lng) <= 180; }
function today_for_tz($tz) {
    try { return (new DateTime('now', new DateTimeZone($tz ?: 'UTC')))->format('Y-m-d'); }
    catch (Throwable $e) { return gmdate('Y-m-d'); }
}
function norm_time($v) {
    $v = trim(strip_tags((string)$v));
    $v = preg_replace('/\s+/', ' ', $v);
    if (preg_match('/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i', $v, $m)) {
        $h = (int)$m[1]; $min = $m[2]; $ampm = strtoupper($m[3]);
        if ($ampm === 'PM' && $h < 12) $h += 12;
        if ($ampm === 'AM' && $h === 12) $h = 0;
        return sprintf('%02d:%s', $h, $min);
    }
    if (preg_match('/^(\d{1,2}):(\d{2})$/', $v, $m)) return sprintf('%02d:%s', (int)$m[1], $m[2]);
    return null;
}
function clean_times($raw) {
    $out = [
        'Fajr' => norm_time($raw['Fajr'] ?? $raw['fajr'] ?? ''),
        'Sunrise' => norm_time($raw['Sunrise'] ?? $raw['sunrise'] ?? ''),
        'Dhuhr' => norm_time($raw['Dhuhr'] ?? $raw['dhuhr'] ?? ''),
        'Asr' => norm_time($raw['Asr'] ?? $raw['asr'] ?? ''),
        'Maghrib' => norm_time($raw['Maghrib'] ?? $raw['maghrib'] ?? ''),
        'Isha' => norm_time($raw['Isha'] ?? $raw['isha'] ?? ''),
    ];
    return ($out['Fajr'] && $out['Dhuhr'] && $out['Asr'] && $out['Maghrib'] && $out['Isha']) ? $out : null;
}
function dist_km($lat1, $lng1, $lat2, $lng2) {
    $r = 6371; $dLat = deg2rad($lat2 - $lat1); $dLng = deg2rad($lng2 - $lng1);
    $a = sin($dLat/2)**2 + cos(deg2rad($lat1))*cos(deg2rad($lat2))*sin($dLng/2)**2;
    return $r * 2 * atan2(sqrt($a), sqrt(1-$a));
}
function cities() {
    return [
        ['id'=>'ps-gaza','ar'=>'غزة','country'=>'فلسطين','countryCode'=>'PS','lat'=>31.5017,'lng'=>34.4668,'tz'=>'Asia/Gaza','method'=>3],
        ['id'=>'ps-khan-yunis','ar'=>'خانيونس','country'=>'فلسطين','countryCode'=>'PS','lat'=>31.3462,'lng'=>34.3036,'tz'=>'Asia/Gaza','method'=>3],
        ['id'=>'ps-rafah','ar'=>'رفح','country'=>'فلسطين','countryCode'=>'PS','lat'=>31.2969,'lng'=>34.2455,'tz'=>'Asia/Gaza','method'=>3],
        ['id'=>'ps-nablus','ar'=>'نابلس','country'=>'فلسطين','countryCode'=>'PS','lat'=>32.2211,'lng'=>35.2544,'tz'=>'Asia/Hebron','method'=>3],
        ['id'=>'ps-hebron','ar'=>'الخليل','country'=>'فلسطين','countryCode'=>'PS','lat'=>31.5326,'lng'=>35.0998,'tz'=>'Asia/Hebron','method'=>3],
        ['id'=>'ps-jerusalem','ar'=>'القدس','country'=>'فلسطين','countryCode'=>'PS','lat'=>31.7683,'lng'=>35.2137,'tz'=>'Asia/Hebron','method'=>3],
        ['id'=>'jo-amman','ar'=>'عمّان','country'=>'الأردن','countryCode'=>'JO','lat'=>31.9552,'lng'=>35.9450,'tz'=>'Asia/Amman','method'=>23],
        ['id'=>'jo-irbid','ar'=>'إربد','country'=>'الأردن','countryCode'=>'JO','lat'=>32.5556,'lng'=>35.85,'tz'=>'Asia/Amman','method'=>23],
        ['id'=>'jo-zarqa','ar'=>'الزرقاء','country'=>'الأردن','countryCode'=>'JO','lat'=>32.0728,'lng'=>36.087,'tz'=>'Asia/Amman','method'=>23],
        ['id'=>'jo-aqaba','ar'=>'العقبة','country'=>'الأردن','countryCode'=>'JO','lat'=>29.5321,'lng'=>35.0063,'tz'=>'Asia/Amman','method'=>23],
        ['id'=>'eg-cairo','ar'=>'القاهرة','country'=>'مصر','countryCode'=>'EG','lat'=>30.0444,'lng'=>31.2357,'tz'=>'Africa/Cairo','method'=>5],
        ['id'=>'eg-alexandria','ar'=>'الإسكندرية','country'=>'مصر','countryCode'=>'EG','lat'=>31.2001,'lng'=>29.9187,'tz'=>'Africa/Cairo','method'=>5],
        ['id'=>'sa-riyadh','ar'=>'الرياض','country'=>'السعودية','countryCode'=>'SA','lat'=>24.7136,'lng'=>46.6753,'tz'=>'Asia/Riyadh','method'=>4],
        ['id'=>'sa-makkah','ar'=>'مكة','country'=>'السعودية','countryCode'=>'SA','lat'=>21.3891,'lng'=>39.8579,'tz'=>'Asia/Riyadh','method'=>4],
        ['id'=>'sa-jeddah','ar'=>'جدة','country'=>'السعودية','countryCode'=>'SA','lat'=>21.4858,'lng'=>39.1925,'tz'=>'Asia/Riyadh','method'=>4],
        ['id'=>'ae-dubai','ar'=>'دبي','country'=>'الإمارات','countryCode'=>'AE','lat'=>25.2048,'lng'=>55.2708,'tz'=>'Asia/Dubai','method'=>8],
        ['id'=>'ae-abudhabi','ar'=>'أبوظبي','country'=>'الإمارات','countryCode'=>'AE','lat'=>24.4539,'lng'=>54.3773,'tz'=>'Asia/Dubai','method'=>8],
        ['id'=>'qa-doha','ar'=>'الدوحة','country'=>'قطر','countryCode'=>'QA','lat'=>25.2854,'lng'=>51.531,'tz'=>'Asia/Qatar','method'=>10],
        ['id'=>'kw-kuwait','ar'=>'مدينة الكويت','country'=>'الكويت','countryCode'=>'KW','lat'=>29.3759,'lng'=>47.9774,'tz'=>'Asia/Kuwait','method'=>9],
        ['id'=>'bh-manama','ar'=>'المنامة','country'=>'البحرين','countryCode'=>'BH','lat'=>26.2285,'lng'=>50.586,'tz'=>'Asia/Bahrain','method'=>8],
        ['id'=>'om-muscat','ar'=>'مسقط','country'=>'عُمان','countryCode'=>'OM','lat'=>23.588,'lng'=>58.3829,'tz'=>'Asia/Muscat','method'=>3],
    ];
}
function nearest_city($lat, $lng) {
    $best = null; $bestKm = 999999;
    foreach (cities() as $city) {
        $km = dist_km($lat, $lng, $city['lat'], $city['lng']);
        if ($km < $bestKm) { $best = $city; $bestKm = $km; }
    }
    $best['distanceKm'] = round($bestKm, 2);
    return $best;
}
function is_gaza_area($lat, $lng, $city) {
    if (in_array($city['id'], ['ps-gaza','ps-khan-yunis','ps-rafah'], true)) return true;
    return $lat >= 31.15 && $lat <= 31.62 && $lng >= 34.15 && $lng <= 34.65;
}
function gaza_table($date) {
    $table = [
      '2026-04-19'=>['Fajr'=>'04:35','Sunrise'=>'06:09','Dhuhr'=>'12:41','Asr'=>'16:19','Maghrib'=>'19:16','Isha'=>'20:37'],
      '2026-04-20'=>['Fajr'=>'04:34','Sunrise'=>'06:08','Dhuhr'=>'12:41','Asr'=>'16:19','Maghrib'=>'19:17','Isha'=>'20:38'],
      '2026-04-21'=>['Fajr'=>'04:33','Sunrise'=>'06:07','Dhuhr'=>'12:41','Asr'=>'16:19','Maghrib'=>'19:18','Isha'=>'20:39'],
      '2026-04-22'=>['Fajr'=>'04:31','Sunrise'=>'06:06','Dhuhr'=>'12:41','Asr'=>'16:19','Maghrib'=>'19:18','Isha'=>'20:40'],
      '2026-04-23'=>['Fajr'=>'04:30','Sunrise'=>'06:05','Dhuhr'=>'12:41','Asr'=>'16:19','Maghrib'=>'19:19','Isha'=>'20:41'],
      '2026-04-24'=>['Fajr'=>'04:29','Sunrise'=>'06:04','Dhuhr'=>'12:40','Asr'=>'16:18','Maghrib'=>'19:20','Isha'=>'20:41'],
      '2026-04-25'=>['Fajr'=>'04:28','Sunrise'=>'06:03','Dhuhr'=>'12:40','Asr'=>'16:18','Maghrib'=>'19:21','Isha'=>'20:42'],
      '2026-04-26'=>['Fajr'=>'04:26','Sunrise'=>'06:02','Dhuhr'=>'12:40','Asr'=>'16:18','Maghrib'=>'19:21','Isha'=>'20:43'],
      '2026-04-27'=>['Fajr'=>'04:25','Sunrise'=>'06:01','Dhuhr'=>'12:40','Asr'=>'16:18','Maghrib'=>'19:22','Isha'=>'20:45'],
      '2026-04-28'=>['Fajr'=>'04:24','Sunrise'=>'06:00','Dhuhr'=>'12:40','Asr'=>'16:18','Maghrib'=>'19:23','Isha'=>'20:45'],
      '2026-04-29'=>['Fajr'=>'04:23','Sunrise'=>'05:59','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:24','Isha'=>'20:46'],
      '2026-04-30'=>['Fajr'=>'04:21','Sunrise'=>'05:58','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:24','Isha'=>'20:47'],
      '2026-05-01'=>['Fajr'=>'04:20','Sunrise'=>'05:57','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:25','Isha'=>'20:48'],
      '2026-05-02'=>['Fajr'=>'04:19','Sunrise'=>'05:56','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:26','Isha'=>'20:49'],
      '2026-05-03'=>['Fajr'=>'04:18','Sunrise'=>'05:55','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:26','Isha'=>'20:50'],
      '2026-05-04'=>['Fajr'=>'04:17','Sunrise'=>'05:55','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:27','Isha'=>'20:51'],
      '2026-05-05'=>['Fajr'=>'04:15','Sunrise'=>'05:54','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:28','Isha'=>'20:52'],
      '2026-05-06'=>['Fajr'=>'04:14','Sunrise'=>'05:53','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:28','Isha'=>'20:53'],
      '2026-05-07'=>['Fajr'=>'04:13','Sunrise'=>'05:52','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:29','Isha'=>'20:54'],
      '2026-05-08'=>['Fajr'=>'04:12','Sunrise'=>'05:51','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:30','Isha'=>'20:55'],
      '2026-05-09'=>['Fajr'=>'04:11','Sunrise'=>'05:51','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:30','Isha'=>'20:55'],
      '2026-05-10'=>['Fajr'=>'04:10','Sunrise'=>'05:50','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:31','Isha'=>'20:56'],
      '2026-05-11'=>['Fajr'=>'04:09','Sunrise'=>'05:49','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:32','Isha'=>'20:57'],
      '2026-05-12'=>['Fajr'=>'04:08','Sunrise'=>'05:48','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:32','Isha'=>'20:59'],
      '2026-05-13'=>['Fajr'=>'04:06','Sunrise'=>'05:47','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:33','Isha'=>'20:59'],
      '2026-05-14'=>['Fajr'=>'04:05','Sunrise'=>'05:47','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:34','Isha'=>'21:00'],
      '2026-05-15'=>['Fajr'=>'04:04','Sunrise'=>'05:46','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:34','Isha'=>'21:01'],
      '2026-05-16'=>['Fajr'=>'04:03','Sunrise'=>'05:45','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:35','Isha'=>'21:02'],
      '2026-05-17'=>['Fajr'=>'04:02','Sunrise'=>'05:45','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:36','Isha'=>'21:03'],
      '2026-05-18'=>['Fajr'=>'04:01','Sunrise'=>'05:44','Dhuhr'=>'12:39','Asr'=>'16:18','Maghrib'=>'19:36','Isha'=>'21:04'],
    ];
    return $table[$date] ?? null;
}
function http_json($url) {
    $ctx = stream_context_create(['http'=>['timeout'=>8,'header'=>"User-Agent: MuslimDaily/1.0\r\nAccept: application/json\r\n"]]);
    $raw = @file_get_contents($url, false, $ctx);
    if (!$raw) return null;
    $json = json_decode($raw, true);
    return is_array($json) ? $json : null;
}
function api_times_by_gps($lat, $lng, $date, $tz, $method) {
    $url = 'https://api.aladhan.com/v1/timings/' . rawurlencode($date) . '?' . http_build_query([
        'latitude'=>$lat, 'longitude'=>$lng, 'method'=>$method, 'timezonestring'=>$tz, 'school'=>0
    ]);
    $json = http_json($url);
    $timings = $json['data']['timings'] ?? null;
    if (!$timings) return null;
    return clean_times($timings);
}

$lat = q('lat'); $lng = q('lng');
if (!valid_coord($lat, $lng)) out_json(['ok'=>false,'error'=>'invalid_coordinates'], 422);
$lat = (float)$lat; $lng = (float)$lng;
$city = nearest_city($lat, $lng);
$date = q('date');
if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = today_for_tz($city['tz']);

if (is_gaza_area($lat, $lng, $city)) {
    $gaza = gaza_table($date);
    if ($gaza) out_json(['ok'=>true,'source'=>'gaza_official_printed_calendar','city'=>'غزة','country'=>'فلسطين','countryCode'=>'PS','lat'=>$lat,'lng'=>$lng,'date'=>$date,'nearestCity'=>$city,'timings'=>$gaza,'prayers'=>$gaza,'prayer_times'=>$gaza]);
}

$times = api_times_by_gps($lat, $lng, $date, $city['tz'], $city['method'] ?? 3);
if ($times) out_json(['ok'=>true,'source'=>'gps_single_prayer_api','city'=>$city['ar'],'country'=>$city['country'],'countryCode'=>$city['countryCode'],'lat'=>$lat,'lng'=>$lng,'date'=>$date,'nearestCity'=>$city,'timings'=>$times,'prayers'=>$times,'prayer_times'=>$times]);

out_json(['ok'=>false,'error'=>'provider_failed','city'=>$city,'date'=>$date], 502);
