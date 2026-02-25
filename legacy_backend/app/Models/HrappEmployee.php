<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HrappEmployee extends Model
{
  use HasFactory;

  const CONNECTION_NAME = 'hrapp';
  const FETCH_REQUESTS_CACHE_KEY = 'fetchRequests';

  public static function initialize() : void {
    $appOption = AppOption::where('option_name', self::CONNECTION_NAME)->first();

    if(!$appOption){
      // Log::alert('hrapp config cannot be found');
      return;
    }

    $options = [
      'driver' => 'mysql',
      "collation" => "utf8mb4_unicode_ci",
      "charset" => "utf8mb4",
      ...$appOption->option_value
    ];

    config(['database.connections.'.self::CONNECTION_NAME
      => $options]);
  }

  static function connection(){
    return DB::connection(self::CONNECTION_NAME);
  }

  static function rawQuery(...$params){
    return self::connection()->select(...$params);
  }

  static function sampleQuery(){
    return self::rawQuery('SELECT CURDATE()');
  }

  static function fetchUsersBuilder($limit = 20){
    // $statement = 'SELECT
    //     u.first_name,
    //     u.last_name,
    //     u.company_email AS email,
    //     uci.mobile_phone,
    //     uji.joined_date,
    //     uji.hired_date,
    //     uji.end_date,
    //     ufi.current_salary,
    //     uji.job_status,
    //     u.status AS active,
    //     d.name AS department,
    //     jti.name AS job_title,
    //     jty.name AS job_position,
    //     u.user_account_id AS id
    //   FROM
    //     users u
    //     LEFT JOIN job_titles jti ON u.job_title_id = jti.id
    //     LEFT JOIN job_types jty ON jti.job_type_id = jty.id
    //     LEFT JOIN job_departments jd ON jd.job_title_id = jti.id
    //     LEFT JOIN departments d ON jd.department_id = d.id
    //     LEFT JOIN user_contact_information uci ON u.id = uci.users_id
    //     LEFT JOIN user_job_info uji ON u.id = uji.user_id
    //     LEFT JOIN user_finance_info ufi ON u.id = ufi.users_id
    //   WHERE first_name LIKE :firstName
    //     AND last_name LIKE :lastName
    //   ORDER BY
    //     u.status DESC
    //   LIMIT 5;';
    return self::connection()
      ->table('users AS u')
      ->select([
        'u.id',
        'u.first_name',
        'u.middle_name',
        'u.last_name',
        'ufd.current_salary',
        'ujd.hired_date',
        'ujd.resignation_date',
        'es.name AS employment_status',
        'u.personal_email',
        'u.company_email',
        'ud.mobile_number',
        'ud.birth_date',
        'ud.gender',
        'js.name AS job_status',
        'jt.name AS job_title',
        'r.name AS position',
        'g.name AS department',
        'sc.status',
      ])
      ->leftJoin('status_classifications AS sc', 'u.current_status', '=', 'sc.id')
      ->leftJoin('user_details AS ud', 'u.id', '=', 'ud.user_id')
      ->leftJoin('user_job_details AS ujd', 'u.id', '=', 'ujd.user_id')
      ->leftJoin('jobs_status AS js', 'ujd.job_status_id', '=', 'js.id')
      ->leftJoin('job_titles AS jt', 'ujd.job_title_id', '=', 'jt.id')
      ->leftJoin('user_group AS ug', 'u.id', '=', 'ug.user_id')
      ->leftJoin('groups AS g', 'ug.group_id', '=', 'g.id')
      ->leftJoin('user_finance_details AS ufd', 'u.id', '=', 'ufd.user_id')
      ->leftJoin('ranks AS r', 'ujd.rank_id', '=', 'r.id')
      ->leftJoin('employment_statuses AS es', 'ujd.employment_status_id', '=', 'es.id')
      ->orderBy('sc.status')
      ->orderBy('u.id', 'desc')
      ->limit($limit);
  }

  static function fetchUsers($names, $limit = 5){
    $builder = self::fetchUsersBuilder($limit);

    switch(count($names)){
      case 1:
        $builder->where(function ($q) use ($names) {
          $name = $names[0];
          $q->where('u.first_name', 'LIKE', "{$name}%")
            ->orWhere( 'u.last_name', 'LIKE', "{$name}%");
        });
        break;
      default:
        $builder->where('u.first_name', 'LIKE', "{$names[0]}%")
          ->where('u.last_name', 'LIKE', "{$names[1]}%");
    }

    $results = $builder->get()->toArray();

    return $results;
  }

  static function gravatarURL($email, $size = 128, $alt = "robohash"){
    $alt = urlencode($alt);

    $gravatarURL = "https://gravatar.com/avatar.php?gravatar_id=" . md5($email) . "&rating=PG&size={$size}&d={$alt}";
    $encodedGravatarURL = urlencode($gravatarURL);
    $imageProxyURL = "https://images.weserv.nl/?url={$encodedGravatarURL}";
    return $imageProxyURL;
  }

  static function attachGravatarURLs($users){
    array_walk_recursive($users, function (&$user, $key) {
      $user->avatarURL = self::gravatarURL($user->company_email, 1024);
    });

    return $users;
  }

  static function attachTenureship($users){
    array_walk_recursive($users, function (&$user, $key) {
      if ($user->resignation_date == null || $user->status === 'active') {
        // $user->tenureship = \Carbon\Carbon::parse($user->hired_date)->diffForHumans(null, true);
        $user->status = 'active';
      } else {
        $statusDate = \Carbon\Carbon::parse($user->resignation_date);
        // $user->tenureship = $statusDate->diffForHumans($user->hired_date, true);
        $user->status = 'resigned on ' . $statusDate->format('F j, Y');
      }

      $user->hired_date = \Carbon\Carbon::parse($user->hired_date)->diffForHumans();
    });

    return $users;
  }

  static function formatData($users){
    array_walk_recursive($users, function (&$user, $key) {
      $user->current_salary = number_format($user->current_salary, 2);
    });

    return $users;
  }

  static function fetchBasicByEmails($emails = [])
  {
    $builder = self::fetchUsersBuilder();
    $builder->whereIn('u.company_email', $emails);
    $users = $builder->get()->toArray();
    $users = self::attachGravatarURLs($users);
    $users = self::attachTenureship($users);
    $users = self::formatData($users);

    return $users;
  }

  static function fetchBasic($keyword, $limit = 5) : array {
    $response = [
      'errors' => [],
      'results' => [
        'users' => []
      ]
    ];

    $keyword = trim($keyword);
    $names = explode(" ", $keyword);

    if (count($names) < 1)
      $response['errors'][] = "please follow this format: 'firstname lastname' OR 'name'";
    else{
      $users = self::fetchUsers($names, $limit);
      $users = self::attachGravatarURLs($users);
      $users = self::attachTenureship($users);
      $users = self::formatData($users);
      $response['results']['users'] = $users;

      if(!count($users))
        $response['errors'][] = "no records found matching specified keyword";
    }

    return $response;
  }

  private static function fetchAttendanceDateList($userID, $limit = 30, $onlyKeepDays = 30){
    // leaves array
    $lwpDates = self::connection()
    ->table('attendance_leaves')
    ->select([
      'attendance_leaves.days',
      'attendance_leaves.is_with_pay',
      'attendance_leaves.is_halfday',
      'attendance_leaves.reason',
      'attendance_leave_category.name as category',
      'status_classifications.status'
    ])
    ->join('attendance_leave_references', 'attendance_leaves.id', '=', 'attendance_leave_references.leave_id')
    ->join('attendance_leave_category', 'attendance_leave_references.category_id', '=', 'attendance_leave_category.id')
    ->leftJoin('status_classifications', 'attendance_leaves.current_status', '=', 'status_classifications.id')
    ->where('attendance_leaves.user_id', $userID)
    ->orderBy('attendance_leaves.id', 'DESC')
    ->limit($limit)
    ->get()
    ->toArray();

    $dateList = [];
    foreach ($lwpDates as $dateRecord) {
      $dates = json_decode($dateRecord->days, true);
      if (is_array($dates)) {
        usort($dates, function ($a, $b) {
          return strtotime($b) - strtotime($a); // Compare the dates in descending order
        });

        foreach ($dates as $date) {
          $daysFromNow = round((strtotime('today') - strtotime($date)) / (60 * 60 * 24));

          if ($daysFromNow > $onlyKeepDays) continue; // discard more than $onlyKeepDays days

          $leaveDetails['is_with_pay'] = $dateRecord->is_with_pay;
          $leaveDetails['is_halfday'] = $dateRecord->is_halfday;
          $leaveDetails['reason'] = $dateRecord->reason;
          $leaveDetails['category'] = $dateRecord->category;
          $leaveDetails['original_dates'] = $dateRecord->days;
          $leaveDetails['days_ago'] = $daysFromNow;
          $leaveDetails['date'] = $date;
          $leaveDetails['status'] = $dateRecord->status;

          // $leaveDetails = $dateRecord->is_with_pay ? " ₱" : "";
          // $leaveDetails .= $dateRecord->is_halfday ? " ½" : "";
          // $leaveDetails .= " ({$daysFromNow} days ago)";

          $dateList[] = $leaveDetails;
        }
      }
    }

    return $dateList;
  }

  private static function fetchAttendanceSummary($start, $end, $userID){
    $statement = "
      select
        sum(late) as total_late_minutes
        , sum(undertime) as total_undertime_minutes
        , sum(lwp) as total_lwp
        , sum(lwop) as total_lwop
        , sum(awol) as awol
        , sum(ncns) as ncns
        , sum(suspension) as suspension
      from
        attendance
      where user_id = :userID
        and work_date between :start and :end
      order by id desc;
    ";

    $results = self::rawQuery($statement, [
      'start' => $start
      , 'end' => $end
      , 'userID' => $userID
    ]);

    $results['dateList'] = self::fetchAttendanceDateList($userID);

    return $results;
  }

  private static function findOneByEmail($email){
    return self::connection()
      ->table('users')
      ->where('company_email', $email)
      ->get()
      ->firstOrFail();
  }

  static function fetchAttendance($email) : array{
    $response = [];

    $user = self::findOneByEmail($email);

    $start = \Carbon\Carbon::now()->subMonths(3);
    $end = \Carbon\Carbon::now();

    $response['start'] = $start;
    $response['end'] = $end;
    $response['summary'] = self::fetchAttendanceSummary($start, $end, $user->id);
    // $response['leaves'] = self::fetchAttendanceLeaves($start, $end, $user->id);

    return $response;
  }

  static function fetchRecentLoansByStatus($status = 'pending', $limit = 50, $additionalConditions = []) {
    $statement = "SELECT
        -- finance_loans.id,
        sa.created_at AS date_approved,
        u.first_name,
        u.last_name,
        u.company_email,
        finance_loan_type.title AS TYPE,
        finance_loans.total_loan_amount,
        finance_loans.loan_amount,
        finance_loans.balance,
        (finance_loans.total_loan_amount / (finance_loans.loan_period * 2)) AS amount_per_cut_off,
        finance_loans.loan_period,
        finance_loans.created_at AS date_applied,
        status_classifications.status,
        IF(finance_loans.is_paid = 1, 'yes', 'no') AS is_paid,
        CASE
            WHEN ujd.resignation_date IS NULL OR sc.status = 'active' THEN 'active'
            ELSE 'resigned'
        END AS employment_status,
        ujd.resignation_date
      FROM
        finance_loans
        LEFT JOIN status_classifications
          ON status_classifications.id = finance_loans.current_status
        LEFT JOIN finance_loan_type
          ON finance_loan_type.id = finance_loans.loan_type_id
        LEFT JOIN users u
          ON u.id = finance_loans.user_id
        LEFT JOIN user_job_details ujd
          ON u.id = ujd.user_id
        LEFT JOIN status_classifications sc
          ON u.current_status = sc.id
        LEFT JOIN (
          SELECT
              model_id,
              created_at,
              ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY created_at DESC) as rn
          FROM status_classifications
          WHERE status = 'approved'
        ) sa ON sa.model_id = finance_loans.id AND sa.rn = 1
      WHERE  status_classifications.status = ?
        AND finance_loan_type.title = 'Salary Loan'
      ";

    // Add additional conditions dynamically
    $params = [$status];
    foreach ($additionalConditions as $condition) {
        if (count($condition) === 3) {
            $column = $condition[0];
            $operator = $condition[1];
            $value = $condition[2];
            $statement .= " AND {$column} {$operator} ?";
            $params[] = $value;
        }
    }

    $statement .= " ORDER BY finance_loans.created_at DESC LIMIT ?";
    $params[] = $limit;

    $results = self::rawQuery($statement, $params);

    // Additional formatting
    foreach ($results as $result) {
        $result->date_applied = Carbon::parse($result->date_applied);
        if ($result->date_approved) {
            $result->date_approved = Carbon::parse($result->date_approved);
        }
    }

    return $results;
}

  static function fetchLoans($email) : array{
    $user = self::findOneByEmail($email);

    $builder = self::connection()
      ->table('finance_loans as fl')
      ->select([
        'flt.title AS type',
        'fl.total_loan_amount AS total_loan',
        'fl.loan_amount AS base_loan',
        // 'fl.cut_off_deduction AS per_cut_off', // handle in selectRaw
        'fl.loan_period AS period',
        'fl.created_at AS date_applied',
        'sc.status'
      ])
      ->selectRaw('(fl.total_loan_amount / (fl.loan_period * 2)) AS per_cut_off')
      ->leftJoin('status_classifications as sc', 'sc.id', '=', 'fl.current_status')
      ->leftJoin('finance_loan_type as flt', 'flt.id', '=', 'fl.loan_type_id')
      ->leftJoin('users as u', 'u.id', '=', 'fl.user_id')
      ->where('u.id', $user->id)
      ->orderBy('fl.created_at', 'DESC')
      ->limit(12);

    // logger()->info($builder->toSql());

    $results = $builder->get()
      ->toArray();

    return $results;
  }

  static function fetchLoansStatistics($email) : array{
    $user = self::findOneByEmail($email);
    $results = [];

    $getBuilder = function() use ($user){
      return self::connection()
        ->table('finance_loans as fl')
        ->leftJoin('status_classifications as sc', 'sc.id', '=', 'fl.current_status')
        ->leftJoin('finance_loan_type as flt', 'flt.id', '=', 'fl.loan_type_id')
        ->where('flt.title', 'Salary Loan')
        ->where('fl.user_id', $user->id);
    };

    $results['total_base_loan_amount'] = $getBuilder()
      ->where('sc.status', 'approved')
      ->sum('fl.loan_amount');

    $results['total_loan_amount'] = $getBuilder()
      ->where('sc.status', 'approved')
      ->sum('fl.total_loan_amount');

    $results['total_approved'] = $getBuilder()
      ->where('sc.status', 'approved')
      ->count('fl.id');

    $results['total_unapproved'] = $getBuilder()
      ->whereNotIn('sc.status', ['approved', 'pending'])
      ->count('fl.id');

    $results['total_base_loan_average'] = $getBuilder()
      ->where('sc.status', 'approved')
      ->avg('fl.loan_amount');

    return $results;
  }

  static function fetchPayrolls($email) : array{
    $user = self::findOneByEmail($email);

    $statement = "SELECT
      finance_payroll.cut_off_date,
      finance_payroll_summary.net_pay - finance_payroll_summary.thirteenth_pay AS net_pay
    FROM
      finance_payroll_summary
      LEFT JOIN users ON users.id = finance_payroll_summary.user_id
      LEFT JOIN finance_payroll ON finance_payroll.id = finance_payroll_summary.payroll_id
      WHERE users.id = ?
      ORDER BY finance_payroll.cut_off_date DESC
      LIMIT 12;";

    $results = self::rawQuery($statement, [
      $user->id
    ]);

    return $results;
  }

  private static function fetchRequestsCondition($conditionArray = ['pending'], $tableAlias = "sc"){
    if(!count($conditionArray)) return;

    $quotedArray = array_map(function ($item) {
      return '"' . $item . '"';
    }, $conditionArray);

    $result = implode(',', $quotedArray);

    return " AND ".$tableAlias.".status in (".$result.")";
  }

  private static function fetchRosterRequestsSubquery($groupIDs, $statuses = ['pending'], $limit = 20)
  {
    $statement = 'select
      \'roster\' as request_type,
      u.first_name as employee_first_name,
      u.last_name as employee_last_name,
      u.company_email as employee_company_email,
      sc.`status`,
      sc.`reason`,
      au.first_name executor_first_name,
      au.last_name executor_last_name,
      au.company_email executor_email,
      json_object(
        \'start_time\', s.`start_time`,
        \'end_time\', s.`end_time`,
        \'date\', ar.`date`,
        \'day\', ar.`day`,
        \'schedule\',s.`legend`
      ) json_details,
      ar.created_at as `timestamp`
    from
      `attendance_rosters` ar
      left join status_classifications sc
        on ar.`current_status` = sc.`id`
      left join attendance_user_has_roster uar
        on ar.`id` = uar.`roster_id`
      left join users u
        on u.`id` = uar.`user_id`
      left join users au
        on au.id = sc.`user_id`
      left join user_group ug
        on u.id = ug.`user_id`
      left join groups g
        on g.id = ug.`group_id`
        left join attendance_schedules s on s.id = ar.`schedule_id`
    where g.id IN (' . $groupIDs . ')
      ' . self::fetchRequestsCondition($statuses) . '
    order by ar.id desc
    limit ' . $limit;

    return $statement;
  }

  private static function fetchOvertimeRequestsSubquery($groupIDs, $statuses = ['pending'], $limit = 20)
  {
    $statement =
    '
      SELECT
        \'overtime\' AS request_type
        , u.first_name AS employee_first_name
        , u.last_name AS employee_last_name
        , u.company_email AS employee_company_email
        , sc.`status`
        , sc.`reason`
        , au.first_name executor_first_name
        , au.last_name executor_last_name
        , au.company_email executor_email
        , JSON_OBJECT (
          "start_time",basetable.`start_time`,
          "end_time",basetable.`end_time`,
          "ot_hrs",basetable.`ot_hrs`,
          "reason",basetable.`reason`
        ) json_details
        , basetable.created_at AS `timestamp`
      FROM
        `attendance_overtime_work` basetable
        LEFT JOIN status_classifications sc
          ON basetable.`current_status` = sc.`id`
        LEFT JOIN users u
          ON u.`id` = basetable.`user_id`
        LEFT JOIN users au
          ON au.id = sc.`user_id`
        LEFT JOIN user_group ug
          ON u.id = ug.`user_id`
        LEFT JOIN groups g
          ON g.id = ug.`group_id`
      where g.id IN (' . $groupIDs . ')
      ' . self::fetchRequestsCondition($statuses) . '
    order by basetable.id desc
    limit ' . $limit;

    return $statement;
  }

  private static function fetchRestdayWorkRequestsSubquery($groupIDs, $statuses = ['pending'], $limit = 20)
  {
    $statement =
    '
      SELECT
        \'restday\' AS request_type
        , u.first_name AS employee_first_name
        , u.last_name AS employee_last_name
        , u.company_email AS employee_company_email
        , sc.`status`
        , sc.`reason`
        , au.first_name executor_first_name
        , au.last_name executor_last_name
        , au.company_email executor_email
        , JSON_OBJECT (
          "start_time",basetable.`start_time`,
          "end_time",basetable.`end_time`,
          "rd_hrs",basetable.`rd_hrs`,
          "rd_ot_hrs",basetable.`rd_ot_hrs`,
          "reason",basetable.`reason`
        ) json_details
        , basetable.created_at AS `timestamp`
      FROM
        `attendance_restday_work` basetable
        LEFT JOIN status_classifications sc
          ON basetable.`current_status` = sc.`id`
        LEFT JOIN users u
          ON u.`id` = basetable.`user_id`
        LEFT JOIN users au
          ON au.id = sc.`user_id`
        LEFT JOIN user_group ug
          ON u.id = ug.`user_id`
        LEFT JOIN groups g
          ON g.id = ug.`group_id`
      where g.id IN (' . $groupIDs . ')
        AND sc.user_id <> ""
      ' . self::fetchRequestsCondition($statuses) . '
    order by basetable.id desc
    limit ' . $limit;

    return $statement;
  }

  private static function fetchLeaveRequestsSubquery($groupIDs, $statuses = ['pending'], $limit = 20)
  {
    $requestsCondition = self::fetchRequestsCondition($statuses);
    $statement =
    <<<EOT
      SELECT
        CONCAT(
          alc.slug,
          '.leave',
          CASE
              WHEN basetable.is_with_pay THEN '.₱'
              ELSE ''
          END,
          CASE
              WHEN basetable.is_halfday THEN '.½'
              ELSE ''
          END
        ) AS request_type
        , u.first_name AS employee_first_name
        , u.last_name AS employee_last_name
        , u.company_email AS employee_company_email
        , sc.`status`
        , sc.`reason`
        , au.first_name executor_first_name
        , au.last_name executor_last_name
        , au.company_email executor_email
        , JSON_OBJECT (
          "type",CONCAT(alc.slug,'.','leave'),
          "days",basetable.`days`,
          "start_date",basetable.`start_date`,
          "end_date",basetable.`end_date`,
          "is_with_pay",basetable.`is_with_pay`,
          "is_halfday",basetable.`is_halfday`
        ) json_details
        , basetable.created_at AS `timestamp`
      FROM
        `attendance_leaves` basetable
        LEFT JOIN attendance_leave_references alr
          ON alr.leave_id = basetable.id
        LEFT JOIN attendance_leave_category alc
          ON alc.id = alr.category_id
        LEFT JOIN status_classifications sc
          ON basetable.`current_status` = sc.`id`
        LEFT JOIN users u
          ON u.`id` = basetable.`user_id`
        LEFT JOIN users au
          ON au.id = sc.`user_id`
        LEFT JOIN user_group ug
          ON u.id = ug.`user_id`
        LEFT JOIN groups g
          ON g.id = ug.`group_id`
      where g.id IN ($groupIDs)
      $requestsCondition
      order by basetable.id desc
      limit $limit
    EOT;

    return $statement;
  }

  private static function fetchTimelogRequestsSubquery($groupIDs, $statuses = ['pending'], $limit = 20)
  {
    // { // obsolete code below
    //   $oldStatement =
    //   '
    //     SELECT
    //       \'timelog\' AS request_type
    //       , u.first_name AS employee_first_name
    //       , u.last_name AS employee_last_name
    //       , u.company_email AS employee_company_email
    //       , sc.`status`
    //       , sc.`reason`
    //       , au.first_name executor_first_name
    //       , au.last_name executor_last_name
    //       , au.company_email executor_email
    //       , JSON_OBJECT (
    //         "log_time",basetable.`log_time`,
    //         "log_type",basetable.`log_type`,
    //         "location",basetable.`location`
    //       ) json_details
    //       , basetable.created_at AS `timestamp`
    //     FROM
    //       `attendance_time_logs` basetable
    //       LEFT JOIN status_classifications sc
    //         ON basetable.`current_status` = sc.`id`
    //       LEFT JOIN users u
    //         ON u.`id` = basetable.`user_id`
    //       LEFT JOIN users au
    //         ON au.id = sc.`user_id`
    //       LEFT JOIN user_group ug
    //         ON u.id = ug.`user_id`
    //       LEFT JOIN groups g
    //         ON g.id = ug.`group_id`
    //     where g.id IN (' . $groupIDs . ')
    //       AND NOT sc.status IN ("active","inactive")
    //     ' . self::fetchRequestsCondition($statuses) . '
    //   order by basetable.id desc
    //   limit ' . $limit;
    // }

    $statement = '
      SELECT
        "timelog" AS request_type,
        u.first_name AS employee_first_name,
        u.last_name AS employee_last_name,
        u.company_email AS employee_company_email,
        sc.`status`,
        sc.`reason`,
        au.first_name AS executor_first_name,
        au.last_name AS executor_last_name,
        au.company_email AS executor_email,
        REPLACE(
          REPLACE(
            REPLACE(
              JSON_OBJECT(
                "log_time", basetable.log_time,
                "log_type", basetable.log_type,
                "location", basetable.location,
                "history",
                CONCAT(
                  "[",
                  (
                    SELECT GROUP_CONCAT(
                      JSON_OBJECT(
                        "created_at", CONVERT_TZ(scr.created_at, "GMT", "Asia/Manila"),
                        "status", scr.status,
                        "author", CONCAT(SUBSTRING_INDEX(scru.first_name, " ", 1), " ", scru.last_name),
                        "reason", scr.reason
                      )
                    SEPARATOR ",")
                      FROM status_classifications AS scr
                      LEFT JOIN users scru ON scr.user_id = scru.id
                      WHERE scr.model_id = basetable.id
                  )
                  ,
                  "]")
              ), "\\\\\"", "\""
            ), "\"[", "["
          ), "]\"", "]"
        )
        AS json_details,
        basetable.created_at AS `timestamp`
      FROM
        `attendance_time_logs` basetable
        LEFT JOIN status_classifications sc
          ON basetable.`current_status` = sc.`id`
        LEFT JOIN users u
          ON u.`id` = basetable.`user_id`
        LEFT JOIN users au
          ON au.id = sc.`user_id`
        LEFT JOIN user_group ug
          ON u.id = ug.`user_id`
        LEFT JOIN groups g
          ON g.id = ug.`group_id`
        LEFT JOIN `status_classifications` scr
          ON `basetable`.id = scr.`model_id`
      WHERE g.id IN (' . $groupIDs . ')
        AND (
          NOT sc.status IN ("active", "active_break", "inactive")
          ' . self::fetchRequestsCondition($statuses) . '
          OR scr.`status` LIKE "pending%"
        )
      GROUP BY `basetable`.id
      ORDER BY basetable.id DESC
      LIMIT '.$limit;

    // Log::info($statement);

    return $statement;
  }

  static function fetchRequests($groupIDs){
    $conditionArray = [];

    $subQueries = [
      self::fetchRosterRequestsSubquery($groupIDs, $conditionArray),
      self::fetchLeaveRequestsSubquery($groupIDs, $conditionArray),
      self::fetchTimelogRequestsSubquery($groupIDs, $conditionArray),
      self::fetchOvertimeRequestsSubquery($groupIDs, $conditionArray),
      self::fetchRestdayWorkRequestsSubquery($groupIDs, $conditionArray),
    ];

    $statement = "";

    foreach ($subQueries as $subQuery) {
      if (!empty($statement)) {
        $statement .= " UNION ALL ";
      }
      $statement .= "(" . $subQuery . ")";
    }

    $statement .= " ORDER BY
      CASE WHEN status LIKE 'pending%' THEN 0 ELSE 1 END,
      `timestamp` DESC";

    // dd($statement);

    $results = self::rawQuery($statement);
    return $results;
  }

  static function formatFetchRequests($requestsCollection)
  {
    $formattedRequests = array_map(function ($request) {
      $request->timestamp = \Carbon\Carbon::parse($request->timestamp);

      $request->executor = [
        'avatar' => self::gravatarURL($request->executor_email),
        'name' => explode(" ", $request->executor_first_name)[0]
      ];
      unset($request->executor_email);
      unset($request->executor_first_name);
      unset($request->executor_last_name);

      $request->employee = [
        'avatar' => self::gravatarURL($request->employee_company_email),
        'name' => explode(" ", $request->employee_first_name)[0]
      ];
      unset($request->employee_first_name);
      unset($request->employee_last_name);
      unset($request->employee_company_email);
      // Perform any other re-formatting required
      return $request;
    }, $requestsCollection);

    return $formattedRequests;
  }

  static function fetchPresentEmployees($groupIDs){
    $statement = <<<EOT
      SELECT
        u.company_email,
        u.first_name,
        u.last_name,
        t.log_type,
        t.location,
        t.log_time,
        t.created_at,
        jt.name `job_title`,
        r.name `position`,
        COALESCE(atts.`start_time`, '9:00') roster_start_time,
        COALESCE(atts.`end_time`, '18:00') roster_end_time,
        ar.date roster_date
      FROM
        users u
        left join user_job_details ujd on u.id = ujd.user_id
        left join job_titles jt on jt.id = ujd.job_title_id
        left join ranks r on r.id = ujd.rank_id
        LEFT JOIN user_group ug
          ON u.id = ug.user_id
        LEFT JOIN groups g
          ON g.id = ug.group_id
        LEFT JOIN attendance_time_logs t
          ON t.user_id = u.id
          AND t.id = (
            SELECT MAX(id)
            FROM attendance_time_logs
            WHERE user_id = u.id
              AND TIMESTAMPDIFF(HOUR, t.`created_at`, NOW()) <= 8
              -- AND log_type = 'In'
          )
          -- AND NOT t.log_type = 'Out'
        LEFT JOIN `attendance_user_has_roster` aur ON u.id = aur.`user_id`
          AND aur.roster_id = (
            SELECT MAX(roster_id)
            FROM `attendance_user_has_roster` aur2
            WHERE user_id = u.id
          )
        LEFT JOIN `attendance_rosters` ar ON ar.`id` = aur.`roster_id`
          AND ar.date = DATE(CONVERT_TZ(NOW(), 'UTC', 'Asia/Manila'))
        LEFT JOIN `attendance_schedules` atts ON atts.`id` = ar.`schedule_id`
        LEFT JOIN `status_classifications` sc on u.current_status = sc.id
      WHERE
        g.id IN ($groupIDs)
        AND NOT sc.status = 'inactive'
      order by u.`last_name`;
    EOT;

    $results = self::rawQuery($statement);

    $formattedResults = array_map(function ($aResultItem) {
      $aResultItem->log_time = \Carbon\Carbon::parse($aResultItem->log_time);
      $aResultItem->created_at = \Carbon\Carbon::parse($aResultItem->created_at);
      $aResultItem->avatar = self::gravatarURL($aResultItem->company_email);
      return $aResultItem;
    }, $results);

    return $formattedResults;
  }

  private static function splitLeaveDays($leave) : array{
    $splitLeaves = [];
    foreach (json_decode($leave->days) as $day) {
      $carbonDate = \Carbon\Carbon::parse($day);
      $splitLeave = clone $leave;
      $splitLeave->day = $carbonDate;
      $splitLeaves[] = $splitLeave;
    }
    return $splitLeaves;
  }

  static function fetchLeaves($groupIDs){
    $groupIDs = explode(",", $groupIDs);
    $results = self::connection()
      ->table('attendance_leaves as a')
      ->select(
        'a.id as leave_id',
        'u.first_name',
        'u.last_name',
        'u.company_email',
        'jt.name as job_title',
        'r.name as position',
        'sc.status',
        DB::raw('CONCAT(a.reason, " ", sc.reason) as reason'),
        'a.start_date',
        'a.end_date',
        'a.days',
        'a.is_halfday',
        'a.period',
        'a.is_with_pay',
        'a.date_issued',
        'au.first_name as executor_first_name',
        'au.last_name as executor_last_name',
        'au.company_email as executor_email'
      )
      ->leftJoin('users as u', 'u.id', '=', 'a.user_id')
      ->leftJoin('user_group as ug', 'u.id', '=', 'ug.user_id')
      ->leftJoin('groups as g', 'g.id', '=', 'ug.group_id')
      ->leftJoin('status_classifications as sc', 'sc.id', '=', 'a.current_status')
      ->leftJoin('user_job_details as ujd', 'u.id', '=', 'ujd.user_id')
      ->leftJoin('job_titles as jt', 'jt.id', '=', 'ujd.job_title_id')
      ->leftJoin('ranks as r', 'r.id', '=', 'ujd.rank_id')
      ->leftJoin('users as au', 'au.id', '=', 'sc.user_id')
      ->whereIn('g.id', $groupIDs)
      ->where(function ($query) {
        $query->where('a.start_date', '>=', DB::raw('DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)'))
              ->orWhere('a.end_date', '>=', DB::raw('DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)'));
      })
      ->whereNotIn('sc.status', ['cancelled'])
      ->orderBy('a.id', 'desc')
      ->limit(100)
      ->get()
      ->toArray();

    $formattedResults = [];
    array_map(function ($aResultItem) use (&$formattedResults) {
      $aResultItem->leave_hash = substr(md5($aResultItem->leave_id), 0, 4);
      $aResultItem->start_date = \Carbon\Carbon::parse($aResultItem->start_date);
      $aResultItem->end_date = \Carbon\Carbon::parse($aResultItem->end_date);
      $aResultItem->avatar = self::gravatarURL($aResultItem->company_email);
      $aResultItem->executor = $aResultItem->executor_first_name;
      $aResultItem->executor_avatar = self::gravatarURL($aResultItem->executor_email);

      unset($aResultItem->leave_id);
      // $aResultItem = self::splitLeaveDays($aResultItem);
      // return $aResultItem;

      $splitLeaves = self::splitLeaveDays($aResultItem);

      $formattedResults = array_merge($formattedResults, $splitLeaves);
    }, $results);

    return $formattedResults;
  }

  static function fetchSpecialDates($groupIDs){
    $statement = <<<EOT
      SELECT
        u.`first_name`,
        u.`last_name`,
        u.`company_email`,
        ud.birth_date,
        jt.name `job_title`,
        r.name `position`
      FROM
        users u
        LEFT JOIN user_details ud ON u.id = ud.user_id
        LEFT JOIN user_group ug ON u.id = ug.`user_id`
        LEFT JOIN groups g ON g.id = ug.`group_id`
        LEFT JOIN user_job_details ujd ON u.id = ujd.user_id
        LEFT JOIN job_titles jt ON jt.id = ujd.job_title_id
        LEFT JOIN ranks r ON r.id = ujd.rank_id
        LEFT JOIN status_classifications sc ON sc.id = u.current_status
      WHERE g.id IN ($groupIDs)
        AND NOT sc.status = 'inactive'
      ORDER BY u.id
      LIMIT 100;
    EOT;

    $results = self::rawQuery($statement);

    $formattedResults = [];
    array_map(function ($aResultItem) use (&$formattedResults) {
      $aResultItem->birth_date = \Carbon\Carbon::parse($aResultItem->birth_date)
        ->setYear(\Carbon\Carbon::now()->year);
      $aResultItem->avatar = self::gravatarURL($aResultItem->company_email);
      $formattedResults[] = $aResultItem;
    }, $results);

    return $formattedResults;
  }

  static function fetchLeavesByEmail($email) : array {
    $user = self::findOneByEmail($email);
    $dateList = self::fetchAttendanceDateList($user->id, 100, 10000);

    return $dateList;
  }

  static function fetchUsersForGallery($page = 1, $keyword = "")
  {
    $test = false;
    $perPage = 100;

    $queryBuilder = self::connection()
      ->table('users')
      ->leftJoin('user_group', 'users.id', '=', 'user_group.user_id')
      ->leftJoin('groups', 'groups.id', '=', 'user_group.group_id')
      ->leftJoin('status_classifications', 'status_classifications.id', '=', 'users.current_status')
      ->leftJoin('user_job_details', 'users.id', '=', 'user_job_details.user_id')
      ->leftJoin('job_titles', 'job_titles.id', '=', 'user_job_details.job_title_id')
      ->leftJoin('ranks', 'ranks.id', '=', 'user_job_details.rank_id')
      ->select(
        'users.first_name',
        'users.last_name',
        'users.company_email',
        'users.personal_email',
        'groups.id AS group_id',
        'groups.name AS department',
        'job_titles.name AS job_title',
        'ranks.name AS position',
        'status_classifications.status',
        'users.created_at'
      )
      ->orderByDesc('users.id');

    $total = $queryBuilder->count();

    $results = $queryBuilder
      // ->paginate($perPage);
      ->simplePaginate($perPage, null, null, $page);

    $avatarSize = 512;
    if($test)
      $avatarSize = 24;

    $formattedResults = [];
    foreach ($results as $aResultItem) {
      if($test)
        $aResultItem->company_email = "nmsitdd+trainee@gmail.com";

      $aResultItem->avatar_personal = self::gravatarURL($aResultItem->personal_email, $avatarSize);
      $aResultItem->avatar = self::gravatarURL($aResultItem->company_email, $avatarSize, 404);
      $formattedResults[] = $aResultItem;
    }

    return [
      "hasMore" => ($page * $perPage) < $total,
      "perPage" => $perPage,
      "total" => $total,
      "page" => $page,
      "list" => $formattedResults
    ];
  }

  private static function fetchAnnualLeavesByEmployee($userId, $hdate, $endDate = null)
  {
      $start = \Carbon\Carbon::parse($hdate)->toDateString();
      $end = $endDate ? \Carbon\Carbon::parse($endDate)->toDateString() : \Carbon\Carbon::today()->addMonth()->toDateString();

      return self::connection()
          ->table('attendance_leaves')
          ->select(
              DB::raw("SUM(
                          CASE
                              WHEN attendance_leaves.start_date BETWEEN '{$start}' AND '{$end}'
                                  OR attendance_leaves.end_date BETWEEN '{$start}' AND '{$end}'
                              THEN CASE
                                  WHEN attendance_leaves.is_halfday = 1
                                      THEN .5
                                  ELSE JSON_LENGTH(attendance_leaves.days)
                              END
                              ELSE 0
                          END
                       ) as total_leaves"),
              DB::raw("SUM(
                          CASE
                              WHEN attendance_leaves.is_with_pay = 1
                                  AND (
                                      attendance_leaves.start_date BETWEEN '{$start}' AND '{$end}'
                                      OR attendance_leaves.end_date BETWEEN '{$start}' AND '{$end}'
                                  )
                              THEN CASE
                                  WHEN attendance_leaves.is_halfday = 1
                                      THEN .5
                                  ELSE JSON_LENGTH(attendance_leaves.days)
                              END
                              ELSE 0
                          END
                       ) as paid_leaves")
          )
          ->where('attendance_leaves.user_id', $userId)
          ->where('sc.status', 'approved')
          ->leftJoin('status_classifications as sc', 'attendance_leaves.current_status', '=', 'sc.id')
          ->first();
  }

  public static function fetchLeavesReportByEmployee($email)
  {
      $user = self::findOneByEmail($email);
      if (!$user) {
        throw new \Exception("User not found in database");
      }

      $queryBuilder = self::connection()
        ->table('users')
        ->select([
          'users.id as _BASEID',
          'user_job_details.employee_id as id',
          'users.first_name',
          'users.last_name',
          'users.company_email',
          'users.personal_email',
          'job_titles.name as job_title',
          'ranks.name as position',
          'user_job_details.hired_date'
        ])
        ->leftJoin('user_job_details', 'users.id', '=', 'user_job_details.user_id')
        ->leftJoin('job_titles', 'job_titles.id', '=', 'user_job_details.job_title_id')
        ->leftJoin('ranks', 'ranks.id', '=', 'user_job_details.rank_id')
        ->where('users.id', $user->id)
        ->orderBy('users.id');

      $results = $queryBuilder->get();

      $hireDate = \Carbon\Carbon::parse($results->first()->hired_date);
      $anniversary = $hireDate->copy()->year(\Carbon\Carbon::now()->year);
      if ($anniversary->gt(\Carbon\Carbon::today())) {
        $anniversary->subYear();
      }
      $hdate = $anniversary->toDateString();

      $report = [];
      $givenAnnivDate = \Carbon\Carbon::parse($hdate);
      $maxYears = 3;

      $totalPaidLeaves = 0;
      $totalLeaves = 0;

      for ($yearsAgo = 0; $yearsAgo <= $maxYears; $yearsAgo++) {
        if($yearsAgo == $maxYears){
          $endDate = $anniversaryDate->copy();
          $anniversaryDate = \Carbon\Carbon::createFromTimestamp(0); // Beginning of Unix epoch
        }else{
          $anniversaryDate = $yearsAgo === 0
            ? $givenAnnivDate
            : $givenAnnivDate->copy()->subYears($yearsAgo);

          $endDate = $yearsAgo === 0 ? null : $anniversaryDate->copy()->addYear();
        }
        $summary = self::fetchAnnualLeavesByEmployee($user->id, $anniversaryDate, $endDate);

        $currentTotal = $summary->total_leaves ?? 0;
        $currentPaid = $summary->paid_leaves ?? 0;

        $totalLeaves += $currentTotal;
        $totalPaidLeaves += $currentPaid;

        $report[$yearsAgo] = [
          'from' => $anniversaryDate->timestamp !== 0 ? $anniversaryDate->toDateString() : "beginning",
          'to' => $endDate ? $endDate->toDateString() : "now",
          'total_leaves' => $currentTotal,
          'paid_leaves' => $currentPaid,
        ];
      }

      return [
        'report' => $report,
        'hired_date' => $results->first()->hired_date,
        'anniversary_date' => $hdate,
        'total_summary' => [
          'total_leaves' => $totalLeaves,
          'paid_leaves' => $totalPaidLeaves
        ]
      ];
  }

  private static function attachAttendanceDataIntoDepartmentEmployees($departmentEmployeesArray){
    if (!is_array($departmentEmployeesArray) || empty($departmentEmployeesArray)) {
      return $departmentEmployeesArray;
    }

    // collect user IDs and build a CASE expression that maps each user_id to its hire date
    $userIds = array_map(fn($emp) => $emp->_BASEID, $departmentEmployeesArray);

    $caseHired = 'CASE attendance_leaves.user_id ';
    foreach ($departmentEmployeesArray as $emp) {
        $hire      = \Carbon\Carbon::parse($emp->hired_date);
        $anniv     = $hire->copy()->year(\Carbon\Carbon::now()->year);
        // if this year's anniversary is already before today, bump to next year
        if ($anniv->gt(\Carbon\Carbon::today())) {
            $anniv->subYear();
        }
        $hdate     = $anniv->toDateString();
        $caseHired .= "WHEN {$emp->_BASEID} THEN '{$hdate}' ";
    }
    $caseHired .= 'END';

    // inject the CASE expression into the raw SUM(...) clauses
    $attendanceSummary = self::connection()
        ->table('attendance_leaves')
        ->select(
            'attendance_leaves.user_id as id',
            DB::raw("SUM(
                        CASE
                          WHEN attendance_leaves.start_date >= {$caseHired}
                            OR attendance_leaves.end_date   >= {$caseHired}
                          THEN CASE
                               WHEN attendance_leaves.is_halfday = 1
                                 THEN .5
                               ELSE JSON_LENGTH(attendance_leaves.days)
                             END
                          ELSE 0
                        END
                     ) as total_leaves"),
            DB::raw("SUM(
                        CASE
                          WHEN attendance_leaves.is_with_pay = 1
                            AND (
                              attendance_leaves.start_date >= {$caseHired}
                              OR attendance_leaves.end_date   >= {$caseHired}
                            )
                          THEN CASE
                               WHEN attendance_leaves.is_halfday = 1
                                 THEN .5
                               ELSE JSON_LENGTH(attendance_leaves.days)
                             END
                          ELSE 0
                        END
                     ) as total_paid_leaves")
        )
        ->whereIn('attendance_leaves.user_id', $userIds)
        ->where('sc.status', 'approved')
        ->leftJoin('status_classifications as sc', 'attendance_leaves.current_status', '=', 'sc.id')
        ->groupBy('attendance_leaves.user_id')
        ->get()
        ->keyBy('id');

    // merge the attendance totals back into the original array
    $departmentEmployeesArray = array_map(function($emp) use ($attendanceSummary) {
        $summary = $attendanceSummary->get($emp->_BASEID);
        $emp->total_leaves      = $summary?->total_leaves      ?? 0;
        $emp->total_paid_leaves = $summary?->total_paid_leaves ?? 0;
        return $emp;
    }, $departmentEmployeesArray);

    return $departmentEmployeesArray;
  }

  static function fetchDepartmentEmployees($groupIDs, $page = 1, $keyword = "")
  {
    $perPage = 100;

    $queryBuilder = self::connection()
      ->table('users')
      ->select(
        'users.id as _BASEID',
        'user_job_details.employee_id as id',
        'users.first_name',
        'users.last_name',
        'users.company_email',
        'users.personal_email',
        'user_details.company_mobile_number',
        'user_details.mobile_number',
        'user_details.birth_date',
        'job_titles.name as job_title',
        'ranks.name as position',
        'user_finance_details.base_salary',
        'user_finance_details.current_salary',
        'user_job_details.hired_date',
        // DB::raw("SUM(CASE
        //   WHEN attendance_leaves.start_date >= user_job_details.hired_date OR attendance_leaves.end_date >= user_job_details.hired_date
        //   THEN JSON_LENGTH(attendance_leaves.days) ELSE 0 END) as total_leaves"),
        // DB::raw("SUM(CASE
        //   WHEN attendance_leaves.is_with_pay = 1 AND (attendance_leaves.start_date >= user_job_details.hired_date OR attendance_leaves.end_date >= user_job_details.hired_date)
        //   THEN JSON_LENGTH(attendance_leaves.days) ELSE 0 END) as total_paid_leaves")
    )
      ->leftJoin('user_details', 'users.id', '=', 'user_details.user_id')
      ->leftJoin('user_group', 'users.id', '=', 'user_group.user_id')
      ->leftJoin('groups', 'groups.id', '=', 'user_group.group_id')
      ->leftJoin('user_job_details', 'users.id', '=', 'user_job_details.user_id')
      ->leftJoin('user_finance_details', 'users.id', '=', 'user_finance_details.user_id')
      ->leftJoin('job_titles', 'job_titles.id', '=', 'user_job_details.job_title_id')
      ->leftJoin('ranks', 'ranks.id', '=', 'user_job_details.rank_id')
      ->leftJoin('status_classifications', 'status_classifications.id', '=', 'users.current_status')
      ->leftJoin('attendance_leaves', 'users.id', '=', 'attendance_leaves.user_id')
      ->leftJoin('attendance_leave_references', 'attendance_leaves.id', '=', 'attendance_leave_references.leave_id')
      ->leftJoin('attendance_leave_category', 'attendance_leave_references.category_id', '=', 'attendance_leave_category.id')
      ->whereIn('groups.id', explode(",", $groupIDs))
      ->whereNotIn('status_classifications.status', ['inactive'])
      ->groupBy('users.id')
      ->orderBy('users.id');

    $total = $queryBuilder->count();

    $results = $queryBuilder
      ->simplePaginate($perPage, null, null, $page);

    $avatarSize = 512;
    $formattedResults = [];
    foreach ($results as $aResultItem) {
      // $aResultItem->id = uniqid();
      $aResultItem->avatar_personal = self::gravatarURL($aResultItem->personal_email, $avatarSize);
      $aResultItem->avatar = self::gravatarURL($aResultItem->company_email, $avatarSize, 404);
      // $aResultItem->avatar = self::gravatarURL($aResultItem->company_email, $avatarSize, 404);

      $formattedResults[] = $aResultItem;
    }

    $formattedResults = self::attachAttendanceDataIntoDepartmentEmployees($formattedResults);

    return [
      "hasMore" => ($page * $perPage) < $total,
      "perPage" => $perPage,
      "total" => $total,
      "page" => $page,
      "list" => $formattedResults
    ];
  }

  public static function getEmployeesOnDutyToday()
  {
    $today = \Carbon\Carbon::today()->toDateString();

    // This will return the EXPLAIN output for the query instead of the actual results
    // The EXPLAIN command shows how MySQL executes the query (index usage, joins, etc.)
    $results = self::connection()
      ->table('attendance_time_logs')
      ->select([
        'users.id as _BASEID',
        'user_job_details.employee_id',
        'users.first_name',
        'users.last_name',
        'users.company_email',
        'job_titles.name as job_title',
        'ranks.name as position',
        DB::raw('IFNULL(CONCAT(parent_group.name, " - ", groups.name), groups.name) as department'),
        'attendance_time_logs.log_time',
        'attendance_time_logs.log_type',
        'attendance_time_logs.location',
        'status_classifications.status as current_status'
      ])
      ->join('users', 'users.id', '=', 'attendance_time_logs.user_id')
      ->leftJoin('user_job_details', 'users.id', '=', 'user_job_details.user_id')
      ->leftJoin('job_titles', 'job_titles.id', '=', 'user_job_details.job_title_id')
      ->leftJoin('ranks', 'ranks.id', '=', 'user_job_details.rank_id')
      ->leftJoin('user_group', 'users.id', '=', 'user_group.user_id')
      ->leftJoin('groups', 'groups.id', '=', 'user_group.group_id')
      ->leftJoin('groups as parent_group', 'parent_group.id', '=', 'groups.parent_group_id')
      ->leftJoin('status_classifications', 'status_classifications.id', '=', 'users.current_status')
      ->whereIn('attendance_time_logs.id', function($query) {
          $query->selectRaw('MAX(id)')
              ->from('attendance_time_logs')
              ->where('log_type', 'IN')
              ->where('log_time', '>=', \Carbon\Carbon::now()->subHours(4))
              ->groupBy('user_id');
      })
      ->where('status_classifications.status', 'active')
      ->orderBy('attendance_time_logs.log_time', 'desc')
      ->orderBy('parent_group.name')
      ->orderBy('groups.name')
      ->get();

    $employees = $results->map(function($item) {
        $item->log_time = \Carbon\Carbon::parse($item->log_time);
        $item->avatar = self::gravatarURL($item->company_email);
        return $item;
    });

    $departments = $results->groupBy('department')
        ->map(function($employees, $department) {
            return [
                'name' => $department,
                'count' => $employees->count()
            ];
        })
        ->sortBy('name')
        ->values()
        ->all();

    return [
      "employees" => $employees,
      "departments" => $departments,
    ];
  }
}
